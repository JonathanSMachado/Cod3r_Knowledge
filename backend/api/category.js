module.exports = app => {
    const { validator } = app.api

    const save = (req, res) => {
        const category = { ...req.body }
        if(req.params.id) category.id = req.params.id

        try {
            validator.existsOrError(category.name, 'Nome da Categoria não informado')
        } catch(errorMsg) {
            return res.status(400).send(errorMsg)
        }

        if(category.id) {
            app.db('categories')
                .update(category)
                .where({ id : category.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            validator.existsOrError(req.params.id, 'Código da Categoria não informado')

            const subcatery = await app.db('categories')
                .where({ parentId: req.params.id })
            validator.notExistsOrError(subcatery, 'Categoria possui subcategorias')

            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            validator.notExistsOrError(articles, 'Categoria possui artigos')

            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            validator.existsOrError(rowsDeleted, 'Categoria não foi encontrada')

            res.status(204).send()
        } catch(errorMsg) {
            res.status(400).send(errorMsg)
        }
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }
        })

        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        const id = req.params.id

        try {
            validator.numberOrError(id, 'ID da categoria deve ser numérico') 

            app.db('categories')
                .where({ id: id })
                .first()
                .then(category => res.json(category))
                .catch(err => res.status(500).send(err))
        
        } catch(errorMsg) {
            res.status(400).send(errorMsg)
        }
        
    }

    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId)

        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })

        return tree
    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(categories)))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }
}