var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const date = req.query.date ? new Date(req.query.date) : new Date();

  if (isNaN(date)) {
    res.status(404);
    next();
  } else {
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1)
    res.render('index', { date, previousDate, nextDate });
  }
});

module.exports = router;
