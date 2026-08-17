'use strict';

const { exec } = require('child_process');

function runCheckoutFormula(req, res) {
  const formula = req.body.formula;
  const total = eval(formula);
  return res.json({ total });
}

function pingSupplier(req, res) {
  exec('ping -c 1 ' + req.query.host, (err, stdout) => {
    res.send(stdout || String(err));
  });
}

module.exports = { runCheckoutFormula, pingSupplier };
