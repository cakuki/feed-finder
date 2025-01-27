var got = require('got');
var utils = require('./utils');
var pkg = require('../package.json');

function request (url, options, cb) {
    options = utils.deepExtend({
        timeout: 1000,
        retries: 2,
        headers: {
            'user-agent': pkg.name + '/' + pkg.version + ' (' +  pkg.homepage + ')'
        }
    }, options);
    return got(url, options, cb);
}

module.exports = request;
