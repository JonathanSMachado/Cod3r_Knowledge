const db = process.argv[2] || 'postgresql'
const config = require('../.env')[db]
const knex = require('knex')(config)
knex.migrate.latest([config])

module.exports = knex