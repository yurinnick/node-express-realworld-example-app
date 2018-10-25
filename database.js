var mongoose = require('mongoose'),
    express = require('express'),
    config = require('./config/index.js');

var app = require('./app');
var isProduction = config.get('env') === 'prod';

if (!isProduction) {
  mongoose.set('debug', true);
}

const mongoHostname = config.get('database').hostname;
const mongoPort = config.get('database').port;
const mongoUrl = `mongodb://${mongoHostname}:${mongoPort}/`
const mongoWaitConnTimeout = 10 // in seconds
const mongoLogLevel = config.get('database').logLevel

const mongoOptions = {
  dbName: config.get('database').db_name,
  useNewUrlParser: true,
  autoReconnect: true,
  reconnectTries: Number.MAX,
  reconnectInterval: 500,
  loggerLevel: mongoLogLevel
};

if (config.get('database').auth) {
  mongoOptions.user = config.get('database').username;
  mongoOptions.pass = config.get('database').password;
}

if (config.get('database').ssl) {
  mongoOptions.ssl = true;
  mongoOptions.sslKey =   fs.readFileSync(config.get('database').sslKeyPath);
  mongoOptions.sslCert =  fs.readFileSync(config.get('database').sslCertPath);
  mongoOptions.sslCA =    fs.readFileSync(config.get('database').sslCAPath);
}

mongoose.connect(mongoUrl, mongoOptions);
var db = mongoose.connection;

// Auto-reconnection when first connect fails
// https://github.com/Automattic/mongoose/issues/5169#issuecomment-314983113
db.on('error', function (err) {
    // If first connect fails because mongod is down, try again later.
    // This is only needed for first connect, not for runtime reconnects.
    // See: https://github.com/Automattic/mongoose/issues/5169
    if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
        console.log(new Date(), String(err));

        // Wait for a bit, then try to connect again
        setTimeout(function () {
            console.log(new Date(), "Retrying first connect...");
            db.openUri(mongoUrl, mongoOptions).catch(() => {});
            // Why the empty catch?
            // Well, errors thrown by db.open() will also be passed to .on('error'),
            // so we can handle them there, no need to log anything in the catch here.
            // But we still need this empty catch to avoid unhandled rejections.
        }, mongoWaitConnTimeout * 1000);
    } else {
        console.error(new Date(), String(err));
    }
});

db.once('open', function () {
    console.log("Connection to db established.");
});

db.once('open', function() {
  app.emit('ready');
});
