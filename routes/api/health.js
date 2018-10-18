var router = require('express').Router();

router.get('/', function(req, res, next) {
  res.json({status: 'UP'});
});

module.exports = router;
