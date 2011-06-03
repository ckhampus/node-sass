var sass = require('../lib/sass.js');

console.log(sass.compile('./style.scss'));
console.log(sass.compile('./style.scss', 'compressed'));
