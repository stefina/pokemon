var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'pokemon'
    },
    port: 3000,
    db_uri: 'mongodb://localhost/pokemon-development',
    db_uri_session: 'mongodb://localhost/session',
    auth: {authdb:"admin"}
  },

  test: {
    root: rootPath,
    app: {
      name: 'pokemon'
    },
    port: 3000,
    db: 'mongodb://localhost/pokemon-test',
    auth: {authdb:"admin"}
  },

  production: {
    root: rootPath,
    app: {
      name: 'pokemon'
    },
    port: 62845,
    db_uri : 'mongodb://stefina_mongoadmin:SmygdiUvad@localhost:20725/pokemon-production',
    db_uri_session: 'mongodb://stefina_mongoadmin:SmygdiUvad@localhost:20725/session',
    auth: {authdb:"admin"}
    // db: 'mongodb://localhost/pokemon-production'
  }
};

module.exports = config[env];
