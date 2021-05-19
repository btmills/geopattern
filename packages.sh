{
  "name": "geopattern",
  "version": "1.2.3",
  "description": "Generate beautiful SVG patterns",
  "keywords": [
    "svg",
    "pattern",
    "geometric",
    "background"
  ],
  "homepage": "http://btmills.github.io/geopattern/",
  "bugs": "https://github.com/btmills/geopattern/issues",
  "license": "MIT",
  "contributors": [
    "Brandon Mills",
    "Jason Long"
  ],
  "main": "lib/index.js",
  "files": [
    "lib/*.js"
  ],
  "scripts": {
    "lint": "eslint .",
    "mocha": "mocha tests",
    "test": "npm run lint && npm run mocha",
    "build": "browserify -s GeoPattern -i buffer . | uglifyjs -mc --screw-ie8 > js/geopattern.min.js",
    "watch": "watchify -s GeoPattern -i buffer . -o js/geopattern.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/btmills/geopattern"
  },
  "dependencies": {
    "object-assign": "^4.1.0"
  },
  "devDependencies": {
    "browserify": "^13.1.1",
    "eslint": "^6.6.0",
    "mocha": "^2.0.1",
    "uglify-js": "^2.7.5",
    "watchify": "^3.7.0",
    "xml-parser": "^1.2.1"
  }
}
