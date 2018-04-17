// Update with your config settings.

module.exports = {

  development: { // this is for the connection to the database
   client: 'mariasql',
   connection: {
     unixSocket    : '/var/run/mysqld/mysqld.sock',
     user     : 'zhaoxin',
     db : 'journal',
     charset  : 'utf8'
   }
 },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
