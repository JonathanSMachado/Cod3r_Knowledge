// const config = require('../knexfile.js')
// const knex = require('knex')(config)
const mysql_params = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'mysql',
        database: 'knowledge'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
}

const postgre_params = {
    client: 'postgresql',
    connection: {
        database: 'knowledge',
        user: 'postgres',
        password: 'postgres'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
}

const knex = require('knex')(mysql_params)
// const knex = require('knex')(postgre_params)

// knex.migrate.latest([config])
knex.migrate.latest([mysql_params])
// knex.migrate.latest([postgre_params])

module.exports = knex