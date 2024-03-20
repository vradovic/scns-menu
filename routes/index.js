var express = require('express');
var router = express.Router();
const { getMenu } = require('../pipeline/db');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const date = req.query.date ? new Date(req.query.date) : new Date(new Date().toISOString().slice(0, 10));

  if (isNaN(date)) {
    res.status(404);
    next();
  } else {
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1)

    const menu = await getMenu(date);
    console.log(date);
    res.render('index', { date, previousDate, nextDate, menu });
  }
});

module.exports = router;
