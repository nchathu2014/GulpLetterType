'use strict';
const PLUGIN_NAME = 'gulp-letter-type';
var through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;
/**
 * This method transform the input string to upper/lower case
 * @param caseType - The transform type upper/lower
 * @param inputString - The input string
 * @returns {string} - The transformed string
 */
var transformText = function(caseType,inputString){
    var outString = null;
    switch(caseType){
        case 'uppercase':
            outString = inputString.toUpperCase();
            break;
        case 'lowercase':
            outString = inputString.toLowerCase();
            break;
        default:
            outString = inputString;
            break;
    }
   return outString;
};

/**
 * This method is used for transforming the text to the target type.
 * @param caseType
 */
var gulpText = function(caseType) {
    return through.obj(function (file, enc, callback) {
        var isBuffer = false,
            inputString = null,
            result = null,
            outBuffer=null;
        //Empty file and directory not supported
        if (file === null || file.isDirectory()) {
            this.push(file);
            return callback();
        }
        isBuffer = file.isBuffer();
        if(isBuffer){
            inputString = new String(file.contents);
            result = transformText(caseType, inputString);
            outBuffer = new Buffer(result);
            var aFile = new gutil.File();
            aFile.path = file.path;
            aFile.contents = outBuffer;
            callback(null,aFile);
        }else{
            this.emit('error',
                new PluginError(PLUGIN_NAME,
                'Only Buffer format is supported'));
            callback();
        }
    });
};
//Export the Method
module.exports = gulpText;
