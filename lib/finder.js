var parser = require('./parser');
var spider = require('./spider');
var utils = require('./utils');

function finder (inputUrl, cb) {
    var urls = spider(inputUrl);

    utils.asyncMap(urls, parser, function (err, data) {
        if (err) return cb(err);

        var results = utils.flatten(data)
            .filter(utils.existent)
            .filter(utils.onlyUnique);

        cb(null, results);
    });
}


module.exports = finder;
