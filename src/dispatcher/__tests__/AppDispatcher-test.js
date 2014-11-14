var expect = require('expect');

describe('AppDispatcher', function() {

	var AppDispatcher;

	beforeEach(function() {
		AppDispatcher = require('../AppDispatcher');
	});

	it('should handle actions', function(done) {
		AppDispatcher.register(function(payload) {
			var action = payload.action;
			switch (action.type) {
				case 'DummyAction':
					expect(action.foo).toBe('bar');
					break;
			}
			done();
		});

		AppDispatcher.handleViewAction({
			type: 'DummyAction',
			foo: 'bar'
		});
	});
});