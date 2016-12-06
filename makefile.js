#!/usr/bin/env node

/* eslint-env shelljs */

'use strict';

var fs = require('fs');
var remark = require('remark');
var remarkHtml = require('remark-html');

require('shelljs/global');

remark = remark.use(remarkHtml);

function tryExec(command, options) {
	var result = exec(command, options);

	if (result.code) {
		var error = new Error(result.stderr);

		error.code = result.code;
		throw error;
	} else {
		return result;
	}
}

function execSilent(command) {
	return tryExec(command, { silent: true });
}

function getExecResult(command) {
	return execSilent(command).stdout.trim();
}

function getCurrentBranch() {
	return getExecResult('git rev-parse --abbrev-ref HEAD');
}

var isRelease = getCurrentBranch() === 'master';

var readme = fs.readFileSync('README.md', 'utf8');

tryExec('git checkout gh-pages');


console.log(remark.process(readme).slice(0, 1000));
