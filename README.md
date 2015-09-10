# gulp-qn-sync

##Install

    npm install gulp-qiniu --save-dev

##content 
  以同步的方式上传文件到七牛云
  
  基于node4.0 gulp4.0的环境下。
  
  主要为了配合 gulp4.0的gulp.series方法
  
  当前的上传任务不完成，则无法进行下一个任务。
  
##demo gulpfile.js
    var qiniu = require('gulp-qn-sync')
    
    gulp.task('js', gulp.series(uploadQiniu));
    
    function uploadQiniu(callback){
    	gulp.src([ files /** filespath */])
    		.pipe(qiniu({
    			accessKey: ACCESSKEY,
    			secretKey: SECRETKEY,
    			bucket: BUCKET.res,
    			private: false
    		}, {
    			dir: 'release/',
    			versioning: true,
    			versionFile: './cdn.json'
    		}))
    		.on('finish', callback);
    }
