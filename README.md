Picomarkdown
============

This is a trimmed-down version of [Micromarkdown.js](https://github.com/SimonWaldherr/micromarkdown.js).  
It is smaller, and doesn't support the AJAX/include or tables functionalities.


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

All credit for Picomarkdown goes to the author of [Micromarkdown.js](https://github.com/SimonWaldherr/micromarkdown.js): [Simon Waldherr](http://twitter.com/simonwaldherr).
