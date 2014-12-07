var connect = require('connect');
var http_proxy = require('http-proxy');

var target = [
  'http://',
  process.env['IMG_PORT_8008_TCP_ADDR'],
  ':',
  process.env['IMG_PORT_8008_TCP_PORT']
].join('')

var proxy = http_proxy.createProxyServer();

function handle_error(error){
  console.error(error)
}

var app = connect()
  .use(function(req, res, next){
    return proxy.web(req, res, {
      target: target
    });
  })

module.exports = app;
