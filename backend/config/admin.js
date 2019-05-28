module.exports = middleware => {
    return (req, res, next) => {
        //TODO: Buscar user no BD para garantir que é ADMIN
        if(req.user.admin) {
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não é administrador')
        }
    }
}
