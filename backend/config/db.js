const db = process.argv[2] || 'postgresql'
const config = require('../.env')[db]
const knex = require('knex')(config)
knex.migrate.latest([config])
    .then(_ => console.log(`Conexão com o ${ db } ativa...`))
    .catch(err => {
        const msg = `ERRO: Não foi possível conectar no ${ db } !`
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
    })

module.exports = knex