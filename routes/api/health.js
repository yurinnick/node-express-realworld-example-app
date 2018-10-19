var router = require('express').Router();
var mongoose = require('mongoose');

router.get('/health', function(req, res, next) {
  res.json({status: 'UP'});
});

router.get('/status', function(req, res, next) {
  apiStatus = true
  dbStatus = !!mongoose.connection.readyState

  globalStatus = apiStatus && dbStatus
  statusCode = globalStatus ? 200 : 500

  function stringStatus(status, failMessage) {
    return status ? 'Running' : failMessage
  }

  res.status(statusCode).json({
    api: stringStatus(apiStatus, 'Some APIs might not be available'),
    database: stringStatus(dbStatus, 'Connection Failed')
  });
});

module.exports = router;
