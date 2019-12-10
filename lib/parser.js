var got = require('got');
var htmlparser = require('htmlparser2');
var path = require('path');
var url = require('url');

var request = require('./request');

var contentTypes = [
    'application/x.atom+xml',
    'application/atom+xml',
    'application/xml',
    'text/xml',
    'application/rss+xml',
    'application/rdf+xml'
];

function parser(url, cb) {
    request(url, function (err, data, response) {
        if (err) return cb(); // ignore error
        var base = null;

        // strip content-type extra info like 'text/xml; charset=utf-8'
        var header = (response.headers['content-type'] || '').split(';')[0];
        if (inc(contentTypes, header)) {
            return cb(null, url);
        }

        var rv = [];

        var parser = new htmlparser.Parser({
            onopentag: function onOpenTag(name, attrs) {
                var feed;

                if (name.toLowerCase() == 'base' && (attrs.href || attrs.HREF)) {
                    base = (attrs.href || attrs.HREF);
                    return;
                }

                if (feed = isFeedLink(url, base, name, attrs)) {
                    return rv.push(feed);
                }

                if (feed = isPossiblyFeed(url, base, name, attrs)) {
                    rv.push(feed);
                }
            },
            onerror: function onError(err) {
                cb(err);
            },
            onend: function onEnd() {
                cb(null, rv);
            }
        });

        parser.parseComplete(data);
    });
}

function isFeedLink (originUrl, base, tagName, attrs) {
    tagName = tagName.toLowerCase();
    var href = attrs.href || attrs.HREF;
    var type = attrs.type || attrs.TYPE;
    var rel = attrs.rel || attrs.REL;
    var badRelTypes = ['sitemap', 'search', 'wlwmanifest'];

    if (href && tagName == 'link' && inc(contentTypes, type) && !inc(badRelTypes, rel)) {
        if (href.indexOf('http') === 0 || href.indexOf('//') === 0 ) {
          return url.resolve(originUrl, href);
        }
        return url.resolve(originUrl, base ? path.join(base, href) : href);
    }
}

function isPossiblyFeed (originUrl, base, tagName, attrs) {
    tagName = tagName.toLowerCase();
    // FeedLike samples:
    //   /feed/zoosk-engineering
    //   /feed/zendesk-engineering
    //   /feed/yld-engineering-blog
    //   /feed/yammer-engineering
    //   /feed/wemake-services
    var feedLike = /(\.(rdf|xml|rss)$|feed=(rss|atom)|(atom|feed|rss)\/?$|(atom|feed|rss)\/.*)/i;
    // Blacklist samples:
    //   sitemap.xml
    //   sitemap-all.xml
    //   search.xml
    //   opensearch.xml
    //   opensearch/description.xml
    //   wlwmanifest.xml
    //   login?return_to=xxx%2Ffeed
    var blacklist = /(add\.my\.yahoo|\.wp\.com\/|\?redir(ect)?=)|\?return_to=|\/.*(sitemap|search).*\.xml|wlwmanifest\.xml/i;

    var href = attrs.href || attrs.HREF;

    if (inc(['a', 'link'], tagName) && feedLike.test(href) && !blacklist.test(href)) {
        if (href.indexOf('http') === 0 || href.indexOf('//') === 0 ) {
          return url.resolve(originUrl, href);
        }
        return url.resolve(originUrl, base ? path.join(base, href) : href);
    }
}

function inc (arr, val) {
    return arr.indexOf(val) > -1;
}

module.exports = parser;
