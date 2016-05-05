var normalizeUrl = require('normalize-url');
var url = require('url');
var utils = require('./utils');


function spider (inputUrl) {
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
        return utils.flatten(inputUrl.map(spider)).filter(utils.onlyUnique);
    }
    var normalizedUrl = normalizeUrl(inputUrl, { stripWWW: false });
    var parsedUrl = url.parse(normalizedUrl);

    var urls = [inputUrl];

    urls.push(normalizeUrl(inputUrl, { stripWWW: true }));
    urls.push(normalizedUrl);

    urls = urls.concat(populateWithKnownFeedEndpoints(parsedUrl));

    return urls.filter(utils.onlyUnique);
}

module.exports = spider;

var knownFeedEndpoints = [
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

function populateWithKnownFeedEndpoints (url) {
    return knownFeedEndpoints.map(function (endpoint) {
        return url.resolve(endpoint);
    });
}

function populateDomains (key) {
    return ['com', 'net', 'org', 'co.uk', 'co', 'io'].map(function (ext) {
        return key + '.' + ext;
    });
}
