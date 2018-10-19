var router = require('express').Router();
var mongoose = require('mongoose');

router.get('/health', function(req, res, next) {
  res.json({status: 'UP'});
});

router.get('/status', function(req, res, next) {
  dbStatus = !!mongoose.connection.readyState ? 'Running' : 'Connection failed'
  res.json({
    api: 'Running',
    database: dbStatus
  });
});

module.exports = router;
