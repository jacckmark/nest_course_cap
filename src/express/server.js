const express = require('express');
const app = express();

app.post('/', function (req, res) {
  console.log(`REQUEST DATA`, req.body);
  res.send('hello from express');
});

app.get(
  '/user',
  function (req, res, next) {
    // logger middleware
    console.log(req.url);
    next();
  },
  function (req, res, next) {
    // guard middleware
    req.user = req.query.name;
    req.user ? next() : next(new Error('forbidden'));
  },
  function (req, res) {
    // request handler
    res.send('Hi ' + req.user);
  },
  function (err, req, res, next) {
    // error handler
    res.json({ status: 500, err });
  },
);

exports.expressApp = app;

app.listen(3001, console.log(`Example app listening on port 3001`));
