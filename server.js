require('node-jsx').install({harmony: true});

var fs = require('fs');
var express = require('express');
var React = require('react');
var Router = require('react-router');
var App = require('./src/components/App');
var routes = require('./src/routes');
var app = module.exports = express();

app.set('port', process.env.PORT || 3001);
app.use(express.static(__dirname + '/public'));

app.use(function(req, res) {
	Router.run(routes, req.url, function(Handler) {
		fs.readFile('public/template.html', 'utf8', function(err, content) {
			res.send(content.replace('{{content}}', React.renderToString(React.createElement(Handler))));
		});
	});
});

app.listen(app.get('port'), function() {
  console.log('test server listening on %d', app.get('port'));
});
