# Sass.js

Sass.js is a small wrapper library around Sass. That means you need to have the Sass gem installed on your server.

## Usage

To use the library just call `compile` with the path to the sass stylesheet and a callback function. The callback function takes the generated css as an argument.

    sass.compile('./style.sass', function (css) {
        console.log(css);
    });
