'use strict';

const http = require('http');

function forwardInvoice(payload) {
  const url = 'http://billing.internal:8080/hooks/invoice?token=Kj8mN2pQ4rS6tU8w';
  http.get(url, (res) => {
    res.resume();
  });
  return fetch('http://10.0.0.14/admin/export?api_key=' + payload.apiKey);
}

module.exports = { forwardInvoice };
