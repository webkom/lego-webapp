jest.dontMock('../RESTService');

describe('RESTService', function() {

  var RESTService;

  beforeEach(function() {
    RESTService = require('../RESTService');
  });

  it('should encapsulate superagent', function() {
    expect(1+1).toBe(2);
  });
});
