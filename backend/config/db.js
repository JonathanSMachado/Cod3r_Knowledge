// const connection_params = {
//     client: '',
//     connection: {
//         database: '',
//         user: '',
//         password: ''
//     },
//     pool: {
//         min: 2,
//         max: 10
//     },
//     migrations: {
//         tableName: 'knex_migrations'
//     }
// }

const args = process.argv[2] || process.env.dbDefault
const { [args]: db_connection} = require('../.env')
const knex = require('knex')(db_connection)
knex.migrate.latest([db_connection])

// if(args && args === 'mysql') {   
    // connection_params.client = 'mysql'
    // connection_params.connection.database = 'knowledge'
    // connection_params.connection.user = 'root'
    // connection_params.connection.password = 'mysql'

// } else {
    // connection_params.client = 'postgresql'
    // connection_params.connection.database = 'knowledge'
    // connection_params.connection.user = 'postgres'
    // connection_params.connection.password = 'postgres'
// }

// const knex = require('knex')(connection_params)

// knex.migrate.latest([connection_params])

module.exports = knex