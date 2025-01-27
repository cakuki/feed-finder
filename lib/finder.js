var parser = require('./parser');
var spider = require('./spider');
var utils = require('./utils');

function finder (inputUrl, options, cb) {
    if (utils.isFunction(options)) {
        cb = options;
        options = {};
    }
    var urls = spider(inputUrl, options);
    var _parser = function (url, cb) {
      parser(url, options, cb);
    };

    utils.asyncMap(urls, _parser, function (err, data) {
        if (err) return cb(err);

        var results = utils.flatten(data)
            .filter(utils.existent)
            .filter(utils.onlyUnique);

        cb(null, results);
    });
}


module.exports = finder;
