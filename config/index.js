const convict = require('convict');

const config = convict({
  env: {
    format: ['prod', 'dev'],
    default: 'dev',
    arg: 'nodeEnv',
    env: 'NODE_ENV'
  },
  application: {
    port: {
      format: 'port',
      default: 3000,
      env: 'APP_PORT'
    },
    secret: {
      format: '*',
      default: 'secret',
      env: 'APP_SECRET',
      sensitive: true
    }
  },
  database: {
    hostname: {
      format: '*',
      default: 'localhost',
      env: 'DB_HOSTNAME'
    },
    port: {
      format: 'port',
      default: 27017,
      env: 'DB_PORT'
    },
    db_name: {
      format: '*',
      default: 'db',
      env: 'DB_NAME'
    },
    auth: {
      format: 'Boolean',
      default: false,
      env: 'DB_ENABLE_AUTH'
    },
    ssl: {
      format: 'Boolean',
      default: false,
      env: 'DB_ENABLE_SSL'
    },
    username: {
      format: '*',
      default: null,
      env: 'DB_USERNAME'
    },
    password: {
      format: '*',
      default: null,
      env: 'DB_PASSWORD',
      sensitive: true
    },
    sslKeyPath: {
      format: '*',
      default: null,
      env: 'DB_SSL_KEY_PATH'
    },
    sslCertPath: {
      format: '*',
      default: null,
      env: 'DB_SSL_CERT_PATH'
    },
    sslCAPath: {
      format: '*',
      default: null,
      env: 'DB_SSL_CA_PATH'
    },
    logLevel: {
      format: ['info', 'error', 'debug'],
      default: 'error',
      env: 'DB_LOG_LEVEL'
    }
   }
});

const env = config.get('env');
config.loadFile(`./config/${env}.json`);

config.validate({ allowed: 'strict' });

module.exports = config;
