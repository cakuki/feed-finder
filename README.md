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

If input misses a dot, all popular tld's appended to input. This takes slightly longer time.

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

### API

```js
var feedFinder = require('feed-finder'),
    feedRead = require('feed-read');

feedFinder('mashable.com', function (err, feedUrls) {
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

## License

[ISC](LICENSE.md) (c) Can Kutlu Kınay
