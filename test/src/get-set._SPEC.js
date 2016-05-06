'use strict';

var rfr = require('rfr'),
	_ = require('lodash'),
	expect = require('chai').expect,
	GetSet = rfr('src/lib/get-set');

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

	it('It throws an error when improper arguments are supplied to a constructor.', function() {

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

	it('It sets the desired fields.', function() {
		var person = new Person({
			name: 'Scotty',
			age: 26
		});

		expect(person._props.name).to.equal('Scotty');
		expect(person._props.age).to.equal(26);
	});


});