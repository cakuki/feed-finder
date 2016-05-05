#! /usr/bin/env node

if (/^v0\.10\.[0-9]+$/.test(process.version)) {
    // Remove max socket limit for 0.10.x
    require('http').globalAgent.maxSockets = Infinity;
    require('https').globalAgent.maxSockets = Infinity;
}

var args = process.argv.slice(2);
var input = args.filter(function (arg) {
    return arg.indexOf('-') != 0;
})[0];

if (!input) {
    fail('Please provide url for searching feeds.');
}

var feedFinder = require('../');

feedFinder(input, function (err, data) {
    if (err) fail(err);

    console.log('Search results for "%s":', input);
    if (data.length)
        console.log('  - ' + data.join('\n  - '));
    else
        console.log('  No results!');
});

function fail(msg) {
    console.error(msg);
    process.exit(1);
}
