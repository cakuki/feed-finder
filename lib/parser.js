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

    if (tagName == 'link' && inc(contentTypes, type)) {
      if (base != null) {
        return url.resolve(originUrl, base ? path.join(base, href) : href);
      }
    }
}

function isPossiblyFeed (originUrl, base, tagName, attrs) {
    tagName = tagName.toLowerCase();
    var feedLike = /(\.(rdf|xml|rss)$|feed=(rss|atom)|(atom|feed|rss)\/?$)/i;
    var blacklist = /(add\.my\.yahoo|\.wp\.com\/|\?redir(ect)?=)/i;

    var href = attrs.href || attrs.HREF;

    if (inc(['a', 'link'], tagName) && feedLike.test(href) && !blacklist.test(href)) {
        return url.resolve(originUrl, base ? path.join(base, href) : href);
    }
}

function inc (arr, val) {
    return arr.indexOf(val) > -1;
}

module.exports = parser;
