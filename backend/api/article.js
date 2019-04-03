const queries = require('./queries')

module.exports = app => {
    const { validator } = app.api

    const save = (req, res) => {
        const article = { ...req.body }

        if(req.params.id) article.id = req.params.id

        try {
            validator.existsOrError(article.name, 'Nome não informado')
            validator.existsOrError(article.description, 'Descrição não informada')
            validator.existsOrError(article.categoryId, 'Categoria não informada')
            validator.existsOrError(article.userId, 'Autor não informado')
            validator.existsOrError(article.content, 'Conteúdo não informado')
        
        } catch (errorMsg) {
            res.status(400).send(errorMsg)
        }

        if(article.id) {
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('article')
                .where({ id: req.params.id })
                .del()
            
            try {
                validator.existsOrError(rowsDeleted, 'Artigo não foi encontrado')
            
            } catch(errorMsg) {
                res.status(400).send(errorMsg)
            }
            
            res.status(204).send()

        } catch(errorMsg) {
            res.status(500).send(errorMsg)
        }
    }

    const limit = 10

    const get = async (req, res) => {
        const page = req.query.page || 1
        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count)

        app.db('articles')
            .select('id', 'name', 'description')
            .limit(limit)
            .offset(page * limit - limit)
            .then(articles => res.json({ data: articles, count, limit }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first()
            .then(article => {
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req, res) => {
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        const ids = categories.rows.map(c => c.id)

        app.db({ a: 'articles', u: 'users' })
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { autor: 'u.name' })
            .limit(limit)
            .offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}