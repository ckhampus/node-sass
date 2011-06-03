var fs    = require('fs'),
    path  = require('path'),
    spawn = require('child_process').spawn;

exports.compile = function (stylesheet, callback, style, compass) {
    // Array containg arguments passed to Sass executable
    var args = new Array(),
        sass,
        basename = path.basename(stylesheet, path.extname(stylesheet)),
        output_dir = path.join('/tmp', basename + Math.floor(Math.random() + new Date().getTime())  + '.css'),
        output_css;
    
    // Set default options
    style = typeof style != 'undefined' ? style : 'nested';
    compass = typeof compass != 'undefined' ? compass : false;

    // Check for Compass support
    if (compass) {
        args.push('--compass');
    }

    // Check if style is valid option    
    switch(style) {
        case 'nested':
        case 'expanded':
        case 'compact':
        case 'compressed':
            args.push('--style', style);
            break;
    }
    
    // Check if stylesheet exists
    if (path.existsSync(stylesheet)) {
        //if (!exists) throw new Error("File doesn't exist.");
          
        // Input
        args.push(stylesheet);
        
        // Output
        args.push(output_dir);
        
        // Compile stylesheet
        sass = spawn('sass', args);
        
        sass.stdout.setEncoding('utf8');
        sass.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        // Check STDERR for errors
        sass.stderr.setEncoding('utf8');
        sass.stderr.on('data', function (data) {
            throw new Error(data);
        });

        sass.on('exit', function (code) {
            if (code === 0) {
                // Read generated css file.
                callback(fs.readFileSync(output_dir, 'utf8'));
            }
        });
    }
};
