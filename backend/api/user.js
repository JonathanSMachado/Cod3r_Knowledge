const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    //const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator
    const { validator } = app.api

    const encryptPassword = password => {
        const salt =  bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {

        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        try {
            validator.existsOrError(user.name, 'Nome não informado')
            validator.existsOrError(user.email, 'E-mail não informado')
            validator.isValidEmailOrError(user.email, 'Email inválido')
            validator.existsOrError(user.password, 'Senha não informada')
            validator.existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
            validator.equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users').where({email: user.email}).first()
            
            if(!user.id) {
                validator.notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
            
        } catch(errorMsg) {
            return res.status(400).send(errorMsg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id) {
            app.db('users')
                .update(user)
                .where({id: user.id})
                .whereNull('deletedAt')
                .then(_ => res.status(201).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(201).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        const id = req.params.id
        
        try {
            validator.numberOrError(id, 'ID do usuário deve ser numérico')
            
            app.db('users')
                .select('id', 'name', 'email', 'admin')
                .where({id: id})
                .whereNull('deletedAt')
                .first()
                .then(user => res.json(user))
                // .then(user => { 
                //     if(user) {
                //         res.json(user)
                //     } else {
                //         res.status(404).send(`Usuário (ID: ${id}) não encontrado`)
                //     }
                // })
                .catch(err => res.status(500).send(err))
            
        } catch(errorMsg) {
            res.status(400).send(errorMsg)
        }
    }

    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where({ userId: req.params.id })
            
            validator.notExistsOrError(articles, 'Usuários possui artigos!')

            const rowsUpdated = await app.db('users')
                .update({deletedAt: new Date() })
                .where({ id: req.params.id })

            validator.existsOrError(rowsUpdated, 'Usuário não foi encontrado')

            res.status(204).send()

        } catch (err) {
            res.status(400).send(err)
        }
    }

    return { save, get, getById, remove }
}