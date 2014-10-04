var express = require('express');
var app = module.exports = express();

app.set('port', process.env.PORT || 3001);
app.use(express.static(__dirname + "/public"));

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(app.get('port'), function() {
  console.log('test server listening on %d', app.get('port'));
});
