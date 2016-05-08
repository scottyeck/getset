# get-set

> Easy runtime typechecking for your constructors.

## Motivation

As an exploration of runtime typechecking mechanisms, I thought it a useful exercise to work on one myself.

## Usage

```js
var Person = GetSet.interface({
	name: {
		type: 'string',
		required: true
	},
	age: {
		type: 'integer',
		required: true
	}
});
```

## Scripts

```bash
# Run unit tests
$ npm run test
```