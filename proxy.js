var cluster = require('cluster');
var numCPUs = require('os').cpus().length;


if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    cluster.fork();
  });
} else {
  var http = require('http');
  var connect = require('connect');
  var express = require('express');
  var http_proxy = require('http-proxy');

  var search_proxy = require('./proxy-apps/search');
  var web_proxy = http_proxy.createProxyServer({});

  http.createServer(search_proxy).listen(9200)
  console.log('listening on port 9200')


  // make the top-level proxy
  //

  function removeFirstWordInURL(req, res, next){
    req.url = req.url.replace(/^\/(\w+)\/?/, '/');
    return next();
  }

  var top_app = express();

  top_app.use(function(req, res, next){
    // check if the subdomain is something other than api
    if (!host.match(/^api\..*/i)){

      // if so, proxy the request to the web app
      var target = [
        'http://',
        process.env['WEB_PORT_3000_TCP_ADDR'],
        ':',
        process.env['WEB_PORT_3000_TCP_PORT']
      ].join('')

      return web_proxy.web(req, res, {
        target: target
      })
    }

    return next()
  })

  top_app.all(/^\/search/, removeFirstWordInURL, search_proxy);
  top_app.all(/^\/db/, removeFirstWordInURL, require('./proxy-apps/db'));
  top_app.all(/^\/img/, removeFirstWordInURL, require('./proxy-apps/img'));
  top_app.all(/^\/parse/, removeFirstWordInURL, require('./proxy-apps/parse'));

  var top_server = top_app.listen(80, function(){
    var host = top_server.address().address
    var port = top_server.address().port

    console.log('top_server listening at http://%s:%s', host, port)
  })
}

