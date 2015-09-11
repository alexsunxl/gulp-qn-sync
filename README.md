# gulp-qn-sync

gulp-qn-sync is a [gulp](https://github.com/wearefractal/gulp) plugin to upload the files which you have concat and minify ,to the Qiniu Cloud CDN in a synchronized manner and record the uploaded files.

## Usage

```javascript
npm install gulp-qiniu --save-dev
```

```javascript
var jeditor = require("gulp-json-editor");
```

## content 

  以同步的方式上传文件到七牛云
  
  基于node4.0 gulp4.0的环境下。
  
  主要为了配合 gulp4.0的gulp.series方法
  
  当前的上传任务不完成，则无法进行下一个任务。
  
## demo gulpfile.js
```javascript

    var qiniu = require('gulp-qn-sync')
    
    gulp.task('js', gulp.series(
    	/** 其他任务，如js，css打包预编译 */
    	// 	task_js,
    	//	task_css,
		uploadQiniu
	));
	/** function task_js(callback){...} */
	/** function task_css(callback){...} */
	 
    
    function uploadQiniu(callback){
    	gulp.src([ files /** filespath */])
			.pipe(qiniu({
				accessKey: ACCESSKEY,
				secretKey: SECRETKEY,
				bucket: BUCKET,
				private: false
			}, {
				dir: 'release/',
				versioning: true,
				recordInFile: './staticfiles.json'
			}))
    		.on('finish', callback);
    }
```
