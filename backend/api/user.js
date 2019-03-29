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
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        const userId = req.params.id || null
        
        try {
            validator.numberOrError(userId, 'ID do usuário deve ser numérico')
            
            app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({id: userId})
            .then(user => { 
                if(user.length > 0) {
                    res.json(user)
                } else {
                    res.send(`Usuário (ID: ${userId}) não encontrado`)
                }
            })
            .catch(err => res.status(500).send(err))
            
        } catch(errorMsg) {
            res.status(400).send(errorMsg)
        }
    }

    return { save, get, getById }
}