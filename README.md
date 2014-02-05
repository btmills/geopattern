# GeoPatterns-JS

This is a JavaScript port of [jasonlong/geo_pattern](https://github.com/jasonlong/geo_pattern) with a [live preview page](http://btmills.github.io/geopatterns-js/geopattern.html).

## Usage

The jQuery plugin [`geopattern.js`](geopattern.js) can be used independently. It requires [jQuery](http://jquery.com/), [Snap.svg](http://snapsvg.io/), and the [CryptoJS](https://code.google.com/p/crypto-js/) SHA-1 library. Add these scripts to your page:

```HTML
<script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha1.js"></script>
<script src="jquery.js"></script>
<script src="snap.svg-min.js"></script>
<script src="geopattern.js"></script>
```

Then, in your script, add a `data-title-sha` attribute to an element, and call `geopattern()` on the element.

```js
var sha = CryptoJS.SHA1('some string').toString();
$('#geopattern')
    .attr('data-title-sha', sha)
    .geopattern();
```

View [`geopattern.html`](geopattern.html) for a complete example.

## License

Licensed under the terms of the MIT License, the full text of which can be read in [LICENSE](LICENSE).
