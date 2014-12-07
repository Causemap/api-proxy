var connect = require('connect');
var http_proxy = require('http-proxy');
var http_auth = require('http-auth');

var target = [
  'http://',
  process.env['ES_PORT_9200_TCP_ADDR'],
  ':',
  process.env['ES_PORT_9200_TCP_PORT']
].join('')

var proxy = http_proxy.createProxyServer();

var basic_auth = http_auth.basic({
  realm: 'Causemap Search API',
  file: [ __dirname, '..', 'search_api.htpasswd'].join('/')
})

function handle_error(error){
  console.error(error)
}

var app = connect()
  .use(function(req, res, next){
    req.socket.on("error", handle_error);
    res.socket.on("error", handle_error);

    // check if the request is for a search endpoint or a GET/OPTIONS request
    if (
      /_search$/.test(req.url.split('?')[0]) ||
      /_suggest$/.test(req.url.split('?')[0]) ||
      ['GET', 'OPTIONS'].indexOf(req.method) != -1
    ){
      // send it along to the proxy
      return proxy.web(req, res, {
        target: target
      });
    }

    next()
  })
  .use(http_auth.connect(basic_auth))
  .use(function(req, res, next){
    return proxy.web(req, res, {
      target: target
    });
  })

module.exports = app;
