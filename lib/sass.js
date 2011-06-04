var fs    = require('fs'),
    path  = require('path'),
    spawn = require('child_process').spawn;

exports.compile = function (stylesheet) {
    // Array containg arguments passed to Sass executable
    var args            = [],
        basename        = path.basename(stylesheet, path.extname(stylesheet)),
        random_number   = Math.floor(Math.random() + new Date().getTime()),
        output_dir      = path.join('/tmp', basename + random_number + '.css'),
        options = {},
        callback;
    
    if (typeof arguments[1] === 'function') {
        callback = arguments[1];
    } else if (typeof arguments[1] === 'object') {
        options = arguments[1];  
    }
    
    if (typeof arguments[2] === 'function') {
        callback = arguments[2];
    }
    
    
    // Check if stylesheet exists
    path.exists(stylesheet, function (exists) {
        if (!exists) throw new Error("File doesn't exist.");

        // Check for Compass support
        if (options.useCompass) {
            args.push('--compass');
        }
    
        // Check if style is valid option    
        switch(options.outputStyle) {
            case 'nested':
            case 'expanded':
            case 'compact':
            case 'compressed':
                args.push('--style', options.outputStyle);
                break;
        }
          
        // Input
        args.push(stylesheet);
        
        // Output
        args.push(output_dir);
        
        // Compile stylesheet
        var sass = spawn('sass', args);
        
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
                fs.readFile(output_dir, 'utf8', function (error, data) {
                    if (error) throw error;
                    
                    callback(data);
                });
            }
        });
    });
};
