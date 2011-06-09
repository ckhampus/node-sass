# Sass

`node-sass` is a small wrapper around the Sass gem. That means you need to have the Sass gem installed on your computer while developing. It's not recommended to use this library for production sites.

## Usage

To use the library just call `compile` with the path to the sass stylesheet and a callback function. The callback function takes the generated css as an argument.

    var sass = require('path/to/sass.js');

    sass.compile('path/to/style.sass', function (err, css) {
        if (err) throw err;

        console.log(css);
    });

It's also possible to pass options to the `compile` function. Currently only two options are available: `outputStyle` and `useCompass`. 

    var sass = require('path/to/sass.js');

    var options = {
        outputStyle: 'nested', // See the official Sass referencs for possible values.
        useCompass: true // Enable Compass modules.
    };

    sass.compile('path/to/style.sass', options, function (err, css) {
        if (err) throw err;

        console.log(css);
    });
