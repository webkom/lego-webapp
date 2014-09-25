var express = require('express');
var faker = require('faker');
var app = module.exports = express();

app.set('port', process.env.PORT || 3001);
app.use(express.static(__dirname + "/public"));

function range(a) {
  var res = [], i = -1;
  while (++i < a) res.push(i);
  return res;
}

var any = faker.Helpers.randomize;

var companyNames = ['Bekk', 'Iterate', 'Itera', 'Netlight', 'Knowit', 'Visma', 'Ciber', 'Google', 'Microsoft']

app.get('/api/articles', function(req, res) {
  res.json(range(10).map(function(i) {
    return {
      id: i+1,
      title: faker.Lorem.sentence(),
      body: faker.Lorem.paragraphs(2)
    };
  }));
});

app.get('/api/events', function(req, res) {
  res.json(range(10).map(function(i) {
    return {
      id: i+1,
      name: any(['Bekk', 'Iterate', 'Itera', 'Netlight', 'Knowit', 'Visma']),
      type: any(['Kurs', 'Bedpress', 'Annet']),
      startsAt: faker.Date.past(1),
      endsAt: faker.Date.recent(4)
    };
  }));
});

app.get('/api/feed', function(req, res) {
  res.json(range(20).map(function(i) {
    return any([
      {
        id: i+1,
        type: 'article',
        payload: {
          title: faker.Lorem.sentence(),
          body: faker.Lorem.paragraphs(2)
        }
      },
      {
        id: i+1,
        type: 'notification',
        payload: {
          description: faker.Lorem.sentence()
        }
      },
      {
        id: i+1,
        type: 'event',
        payload: {
          name: any(['Bekk', 'Iterate', 'Netlight', 'Knowit', 'Visma']),
          type: any(['Kurs', 'Bedpress', 'Annet']),
          description: faker.Lorem.paragraphs(4),
          image: 'http://lorempixel.com/940/160/',
          startsAt: faker.Date.past(1),
          endsAt: faker.Date.recent(4)
        }
      }
    ]);
  }));
});

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(app.get('port'), function() {
  console.log('test server listening on %d', app.get('port'));
});
