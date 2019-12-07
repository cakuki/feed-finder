# feed-finder

> Stubborn feed auto discovery tool.

There wasn't any satisfyingly determined feed discover tool in npm, so here it is. Highly inspired by [damog](https://github.com/damog)'s [feedbag](https://github.com/damog/feedbag).

## Install

For programmatic use in your project:
```sh
npm install --save feed-finder
```

For cli usage:
```sh
npm install --global feed-finder
```

## Usage

For programmatic usage see [API](#api) section.

### CLI

CLI command takes only one input as domain:
```sh
$> feed-finder mashable.com

Search results for "mashable.com":
  - http://feeds.mashable.com/Mashable
  - http://mashable.com/feed/
```

If input misses a dot, some popular tld's appended to input. This takes slightly longer time.

```sh
$> feed-finder wired

Search results for "wired":
  - http://www.wired.com/feed/
  - http://www.wired.com/feed/podcast
  - http://wired.com/?feed=rss
  - http://wired.com/feed/
  - http://wired.com/feed/rss/
  - http://wired.com/services/rss/
  - http://wired.net/?feed=rss
  - http://www.wired.co.uk/news/rss
  - http://www.wired.co.uk/reviews/rss
  - http://www.wired.co.uk/podcast/rss
  - http://www.wired.co.uk/rss
  - http://wired.co.uk/rss
  - http://wired.co.uk/podcast/rss
  - http://wired.co.uk/feed/rss/
  - http://wired.co.uk/services/rss/
```

(Some results are clipped from actual result, as they were bloating too much)

#### Options

##### --no-guess
Disables known feed endpoint checks, only looks feeds in input url.

##### --no-www-switch
Disables www switch. By default feed-finder adds missing www and looks for that domain too, and removes www when it's provided.

### API

```js
var feedFinder = require('feed-finder'),
    feedRead = require('feed-read');
var options = {noWWWSwitch: true};

feedFinder('mashable.com', options, function (err, feedUrls) {
    if (err) return console.error(err);

    feedUrls.forEach(function (feedUrl) {
        feedRead(feedUrl, function (err, articles) {
            if (err) throw err;
            // Each article has the following properties:
            //
            //   * "title"     - The article title (String).
            //   * "author"    - The author's name (String).
            //   * "link"      - The original article link (String).
            //   * "content"   - The HTML content of the article (String).
            //
        });
    });
});
```

feed-read module is given just for sake of this example. There are numerous feed readers parsers in the wild.

#### Options
- `noGuess` _default: false_ - Disables known feed endpoint checks, only looks feeds in input url.
- `noWWWSwitch` _default: false_ - Disables www switch. By default feed-finder adds missing www and looks for that domain too, and removes www when it's provided.
- `knownFeedEndpoints` - known feed endpoint list.
<br>_default:_
```js
[
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
]
```
You can provide other endpoints or update their order. e.g.
```js
[
    '/feed/',
    '/feed.xml',
    '/atom.xml',
    '/rss.xml',
    '/feed',
    '/feed/rss/',
    '/feed/rss2/',
    '/feed/rdf/',
    '/feed/atom/',
    '/services/rss/'
]
```
- `gotOptions` - This object is passed to [`got` options](https://github.com/sindresorhus/got/tree/v5.6.0#api) directly (refer to [`got` documentation](https://github.com/sindresorhus/got/tree/v5.6.0)).
<br>_default:_
```js
{
    timeout: 1000,
    retries: 2,
    headers: {
        'user-agent': pkg.name + '/' + pkg.version + ' (' +  pkg.homepage + ')'
    }
}
```

## License

[ISC](LICENSE.md) (c) Can Kutlu Kınay
