'use strict';

var rfr = require('rfr'),
	_ = require('lodash'),
	chai = require('chai'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	GetSet = rfr('src/get-set');

var expect = require('chai').expect;

chai.use(sinonChai);

var SPY = {};

var SPY_METHODS = [
	'set',
	'get'
];

describe('GetSet', function() {

	function Person(initConfig) {
		this.initialize(initConfig);
	}

	_.extend(Person.prototype, GetSet.prototype);

	Person.prototype.useInterface({
		name: {
			type: 'string',
			required: true
		},
		age: {
			type: 'integer',
			required: true
		}
	});

	beforeEach(function() {
		
		_.each(SPY_METHODS, function(methodName) {
			SPY[methodName] = sinon.spy(Person.prototype, methodName);
		});
	});

	afterEach(function() {
		_.each(SPY_METHODS, function(methodName) {
			SPY[methodName].restore();
		});
	});

	describe('[constructor]', function() {

		it('It throws an error when constructor arguments fail to meet interface requirements.', function() {

			expect(function() {
				var person = new Person();
			}).to.throw;
		});

		it('It throws an error when fields are supplied with incorrect type.', function() {

			expect(function() {
				var person = new Person({
					name: 'Scotty',
					age: 'foo'
				});
			}).to.throw;
		});

		it('It throws an error when required fields are not supplied.', function() {

			expect(function() {
				var person = new Person({
					name: 'Scotty'
				});
			}).to.throw;
		});

		it('It hands off to `.set()` as desired.', function() {

			SPY.set.reset();

			var person = new Person({
				name: 'Scotty',
				age: 26
			});

			expect(SPY.set).to.have.been.calledTwice;
			expect(SPY.set).to.have.been.calledWith('name', 'Scotty');
			expect(SPY.set).to.have.been.calledWith('age', 26);
		});
	});

	describe('.set()', function() {

		var person;

		beforeEach(function() {
			person = new Person({
				name: 'Scotty',
				age: 26
			});
		});

		it('It throws an error when the key is invalid.', function() {

			expect(function() {
				person.set('foo', 'bar')
			}).to.throw;
		});

		it('It throws an error when the value is of an incorrect type.', function() {

			expect(function() {
				person.set('name', 26)
			}).to.throw;
		});

		it('It sets the proper instance variables.', function() {
			expect(person._props.name).to.equal('Scotty');
			expect(person._props.age).to.equal(26);
		});
	});

	describe('.get()', function() {

		var person;

		beforeEach(function() {
			person = new Person({
				name: 'Scotty',
				age: 26
			});
		});

		it('It returns undefined when the desired key does not exist.', function() {
			expect(person.get('foo')).to.equal(undefined);
		});

		it('It returns the desired property value.', function() {
			expect(person.get('name')).to.equal('Scotty');
			expect(person.get('age')).to.equal(26);
		});
	});

	describe('.useInterface()', function() {

		var Foo;

		beforeEach(function() {

			Foo = function(initConfig) {
				this.initialize(initConfig);
			}

			_.extend(Foo.prototype, GetSet.prototype);

		});

		it('It throws an error if the interface has invalid property values.', function() {

			expect(function() {
				Foo.useInterface({
					foo: {
						'bar': 'baz'
					}
				}).to.throw();
			});

			expect(function() {
				Foo.useInterface({
					foo: {
						'type': 'string',
						'required': 'baz'
					}
				}).to.throw();
			});
		});

		it('It throws an error if the interface requests an unavailable type', function() {

			expect(function() {
				Foo.useInterface({
					foo: {
						'type': 'baz'
					}
				}).to.throw();
			});
		});

		it('It sets the interface as desired.', function() {

			var _interface = {
				foo: {
					type: 'string',
					required: true
				}
			};

			Foo.prototype.useInterface(_interface);

			expect(Foo.prototype._interface).to.equal(_interface);
		});
	});
});