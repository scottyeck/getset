'use strict';

var _ = require('lodash');

var TYPE_CHECK_METHODS = {
	array: _.isArray,
	boolean: _.isBoolean,
	buffer: _.isBuffer,
	date: _.isDate,
	element: _.isElement,
	error: _.isError,
	function:  _.isFunction,
	integer:  _.isInteger,
	nan: _.isNaN,
	null: _.isNull,
	number: _.isNumber,
	object: _.isObject,
	plainObject:  _.isPlainObject,
	regexp: _.isRegExp,
	string:  _.isString,
	undefined: _.isUndefined
};

function GetSet(initConfig) {}

GetSet.prototype.initialize = function(initConfig) {

	var self = this;

	if (!_.isUndefined(this._props)) {
		throw Error('TODO');
	}
	this._props = {};

	_.each(initConfig, function(val, key) {
		self.set(key, val);
	});

	_.each(this._interface, function(entry, prop) {
		if (entry.default && _.isUndefined(self.get(prop))) {
			self.set(prop, _.clone(entry.default));
		}
		if (entry.required && _.isUndefined(self.get(prop))) {
			throw Error('TODO');
		}
	});
};

GetSet.prototype.set = function(prop, val) {

	var propEntry = this._interface[prop];

	if (propEntry && TYPE_CHECK_METHODS[propEntry.type](val) && (!propEntry.validate || propEntry.validate(val))) {
		this._props[prop] = val;
	} else {
		throw Error('Cannot set prop: ' + prop + ' with val: ' + val);
	}
};

GetSet.prototype.get = function(prop) {
	
	return this._props[prop];
};

GetSet.prototype.useInterface = function(_interface) {
	if (!_.isPlainObject(_interface)) {
		throw Error('TODO');
	}

	_.each(_interface, function(entry) {
		_.each(entry, function(val, key) {

			var isValidTypeKey = (key === 'type' && _.isFunction(TYPE_CHECK_METHODS[val])),
				isValidRequiredKey = (key === 'required' && _.isBoolean(val)),
				isValidValidateKey = (key === 'validate' && _.isFunction(val)),
				isValidDefaultKey = (key === 'default');
			
			if (!isValidTypeKey && !isValidRequiredKey && !isValidValidateKey && !isValidDefaultKey) {
				throw Error('Received ' + val + ' and ' + key);
			}
		});
	});

	this._interface = _interface;
};

GetSet.prototype.toPlainObj = function() {
	return this._props;
};

GetSet.interface = function(_interface) {

	function Descendent(initConfig) {
		this.initialize(initConfig);	

		if (_.isFunction(this.onConstruct)) {
			this.onConstruct();
		}
	}

	_.extend(Descendent.prototype, this.prototype);

	Descendent.prototype.useInterface(_interface);

	return Descendent;
}

module.exports = GetSet;