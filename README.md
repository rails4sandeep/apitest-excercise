### Introduction

* The API tests are written in Nodejs. 
* Mocha is the test framework used.
* Chai is used for writing assertions.
* Superagent is used for sending and receiving http requests

### Installation

It is assumed the user already has nodejs installed on the machine.

At the root of the directory

`npm install`

### Running tests

You can simply `npm test` or 
`mocha test/aupost.test.js`

Note: Before running the tests, do not forget to add the AUPOST API key to data json config file.

