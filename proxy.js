var http = require('http');
var http_proxy = require('http-proxy');
var http_auth = require('http-auth');

var proxy = http_proxy.createProxyServer({
  target: [
    'http://',
    process.env['ES_PORT_9200_TCP_ADDR'],
    ':',
    process.env['ES_PORT_9200_TCP_PORT']
  ].join('')
})

var basic_auth = auth.basic({
  realm: 'Causemap Search API',
  file: [ __dirname, 'search_api.htpasswd'].join('/')
})

var allow_whatever_for_search = function(req, res, next){
  // TODO: check if the path ends in '_search'
  console.log(req);
  next();
}


http.createServer(allow_whatever_for_search, function(req, res){
  return proxy.web(req, res);
}).listen(9200)


console.log('listening on port 9200')
