var sass = require('../lib/sass.js');

sass.compile('./style.scss', function (css) {
    console.log(css);
});