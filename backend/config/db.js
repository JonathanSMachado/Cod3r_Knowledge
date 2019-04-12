let args = process.argv[2]

if(!args) {
    console.log('Changing to default database...')
    const { dbDefault } = require('../.env')
    args = dbDefault
}

const { [args]: db_connection } = require('../.env')
const knex = require('knex')(db_connection)
knex.migrate.latest([db_connection])

module.exports = knex