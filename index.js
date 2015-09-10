"use strict";
var path = require('path')
var fs = require('fs')
var crypto = require('crypto')
var util = require('util')
var through2 = require('through2')
var gulpUtil = require('gulp-util')
var qn = require('qn')
var q = require('q')
var moment = require('moment')

var colors = gulpUtil.colors
var log  = gulpUtil.log
var pluginError = gulpUtil.PluginError
var uploadedFiles = 0
var totalFiles = 0


module.exports = function(config, options){
	var options = options || {}
	var options = extend( {dir: '', versioning: false, versionFile: null}, options );
  	var qn = qn.create(qiniu)
    var version = Moment().format('YYMMDDHHmm')


    return through2.obj(function(file, enc, next){

	    var that = this;
	    var isIgnore = false;
	    var filePath = path.relative(file.base, file.path);

	    if (file._contents === null) return next();
        var fileKey = option.dir + ((!option.dir || option.dir[option.dir.length - 1]) === '/' ? '' : '/') + (option.versioning ? version + '/' : '') + filePath;
    	var fileHash = calcHash(file);

    	//以同步的方式处理 文件上传
    	q.nbind(qn.stat, qn)(fileKey).spread(function(stat){
    		if (stat.hash === fileHash) return false;
    		return Q.nbind(qn.delete, qn)(fileKey)
    	}, function(){ return true;})
    	.then(function(isUpload){
    		totalFiles ++ 
    		if (isUpload === false) return false
    		return Q.nbind(qn.upload, qn)(file._contents, {key: fileKey})
    	})
    	.then(function (stat){
    		if( stat === false ){
    			log('Skip:', colors.grey(filePath));
    			return 
    		}
    		uploadedFiles ++
    		log('Upload:', colors.green(filePath), '→', colors.green(fileKey));
    	}, function(err){
    		log('Error', colors.red(filePath));

    	})
    	.then(function(){
    		next();
    	})

    }, function(){ /* flushFunction */
    	log('Total:', colors.green(uploadedFiles + '/' + totalFiles));

        // Check if versioning
        if (!option.versioning) return;
        log('Version:', colors.green(version));

        if (option.versionFile) {
          fs.writeFileSync(option.versionFile, JSON.stringify({version: version}))
          log('Write version file:', colors.green(option.versionFile));
        }
    });

}


function extend(target, source) {
    target = target || {};
    for (var prop in source) {
        if (typeof source[prop] === 'object') {
            target[prop] = extend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
}

/**
 * Calc qiniu etag
 *
 * @param file
 * @returns {*}
 */
function calcHash(file) {
    if (file.size > 1 << 22) return false;
    var shasum = crypto.createHash('sha1');
    shasum.update(file._contents);
    var sha1 = shasum.digest();
    var hash = new Buffer(1 + sha1.length);
    hash[0] = 0x16;
    sha1.copy(hash, 1);
    return hash.toString('base64').replace('+', '-').replace('/', '_');
}


