var fs    = require('fs'),
    path  = require('path'),
    spawn = require('child_process').spawn;

exports.input_extensions = [".scss", ".sass"];

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
    } else if (typeof arguments[2] === 'function') {
        callback = arguments[2];
    }
    
    if (typeof arguments[1] === 'object') {
        options = arguments[1];  
    }
    
    // Check if stylesheet exists otherwise throw error.
    path.exists(stylesheet, function (exists) {
        if (!exists) callback(new Error("'" + stylesheet + "'  doesn't exist."), null);

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
        
        // Disable default Sass cache
        args.push('-C');
          
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
            callback(new Error(data));
        });

        sass.on('exit', function (code) {
            if (code === 0) {
                // Read generated css file.
                fs.readFile(output_dir, 'utf8', function (error, data) {
                    if (error) callback(error, null);
                    
                    callback(null, data);
                });
            }
        });
    });
};
