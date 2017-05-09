Picomarkdown [![NPM Version](http://img.shields.io/npm/v/picomarkdown.svg?style=flat)](https://www.npmjs.org/package/picomarkdown) [![Bower Version](http://img.shields.io/bower/v/picomarkdown.svg?style=flat)](http://bower.io/search/?q=picomarkdown)
============

[![Greenkeeper badge](https://badges.greenkeeper.io/developit/picomarkdown.svg)](https://greenkeeper.io/)

This is a trimmed-down version of [Micromarkdown.js](https://github.com/SimonWaldherr/micromarkdown.js).  
It is smaller, and doesn't support the AJAX/include or tables functionalities.

Demo
----

Here's a simple JSFiddle demo of the parser:  
**[Picomarkdown Demo](http://jsfiddle.net/developit/Lg5mcane/)**


About
-----

License:   **MIT**  
Version: **0.1.0**  
Date:  **10.2014**  


Usage
-----

Adjust to suit your preferred module format.

```js
var md = require('picomarkdown');

var html = md.parse('*this* is __easy__ to `use`.');
console.log(html);
```


Credits
-------

All credit for Picomarkdown goes to the author of [Micromarkdown.js](https://github.com/SimonWaldherr/micromarkdown.js), on which this library is shamelessly based: [Simon Waldherr](http://twitter.com/simonwaldherr).
