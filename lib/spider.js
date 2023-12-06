var url = require('url');
var utils = require('./utils');


function spider (inputUrl, options) {
    if (inputUrl.indexOf('feed:') == 0) {
        return [inputUrl.replace('feed:', '')];
    }
    if (inputUrl.indexOf('http') != 0) {
        inputUrl = 'http://' + inputUrl;
    }
    if (inputUrl.indexOf('.') == -1) {
        inputUrl = populateDomains(inputUrl);
    }
    if (Array.isArray(inputUrl)) {
        return utils.flatten(inputUrl.map(function (url) {
            return spider(url, options);
        })).filter(utils.onlyUnique);
    }

    var alternativeUrl;
    if (!options.noWWWSwitch) {
        if (/\bwww\./.test(inputUrl)) {
            alternativeUrl = inputUrl.replace(/\bwww\./, '');
        } else {
            alternativeUrl = inputUrl.replace(/:\/\//, '://www.');
        }
    }

    var urls = [
        inputUrl,
        alternativeUrl
    ];

    if (!options.noGuess) {
        urls.push(
            populateWithKnownFeedEndpoints(inputUrl, options.knownFeedEndpoints || defaultKnownFeedEndpoints),
            populateWithKnownFeedEndpoints(alternativeUrl, options.knownFeedEndpoints || defaultKnownFeedEndpoints)
        )
    }

    return utils.flatten(urls).filter(utils.onlyUnique).filter(utils.existent);
}

module.exports = spider;

var defaultKnownFeedEndpoints = [
    '/?feed=rss',
    '/?feed=rss2',
    '/?feed=rdf',
    '/?feed=atom',
    '/feed/',
    '/feed/rss/',
    '/feed/rss2/',
    '/feed/rdf/',
    '/feed/atom/',
    '/services/rss/'
];

function populateWithKnownFeedEndpoints (inputUrl, knownFeedEndpoints) {
    if (!inputUrl) return;
    inputUrl = url.parse(inputUrl);
    return knownFeedEndpoints.map(function (endpoint) {
        return inputUrl.resolve(endpoint);
    });
}

function populateDomains (key) {
    return ['com', 'net', 'org', 'co.uk', 'co', 'io'].map(function (ext) {
        return key + '.' + ext;
    });
}
