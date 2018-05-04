

 let gulp = require('gulp');
//let yargs = require('yargs').argv;//获取运行gulp命令时附加的命令行参数
// clean = require('gulp-clean'),//清理文件或文件夹
//let replace = require('gulp-replace-task');//对文件中的字符串进行替换
// browserSync = require('browser-sync'),//启动静态服务器
//let transport = require("gulp-seajs-transport"); //对seajs的模块进行预处理：添加模块标识
//let concat = require("gulp-seajs-concat");//seajs模块合并
let uglify = require('gulp-uglify');//js压缩混淆
let rename = require('gulp-rename');
let cleanCSS = require('gulp-clean-css');
let clean = require('gulp-clean');
let gzip = require('gulp-gzip');
let tar = require('gulp-tar');
let fs = require('fs');
let path = require('path');

var tinylr = require('tiny-lr');
var server = tinylr();
var port = 1234;

let runSequence = require('run-sequence');
let rev = require('gulp-rev');
let revCollector = require('gulp-rev-collector');

let src = 'src';
let dist = 'dist';

var imageMin = require('gulp-imagemin');
gulp.task('image-min',function(){
    gulp.src(src + '/images/*.*')
        .pipe(imageMin({progressive: true}))
        .pipe(gulp.dest(dist + '/images'))
})

var spriter = require('gulp-css-spriter');
 
gulp.task('img-spriter', function() {
    return gulp.src(src + '/css/index.css')//比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。 很重要 注意(recharge.css)这个是我的项目。别傻到家抄我一样的。
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            'spriteSheet': dist + '/images/spritesheet.png', //这是雪碧图自动合成的图。 很重要
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            'pathToSpriteSheetFromCSS': '../images/spritesheet.png' //这是在css引用的图片路径，很重要
        }))
        .pipe(gulp.dest(dist + '/css')); //最后生成出来
});
	
	
// 压缩js
gulp.task("js-min", function () {

	gulp.src(src + '/js/*.js')
		.pipe(uglify())
		.pipe(rename(function (path) {
			
			path.basename += ".min";
			
		  }))
		.pipe(gulp.dest(dist));
});

gulp.task('css-min', () => {
	return gulp.src(src + '/css/*.css')
	  .pipe(cleanCSS({compatibility: 'ie8'}))
	  .pipe(rename(function (path) {
			
		path.basename += ".min";
		
	  }))
	  .pipe(gulp.dest(dist + '/css/'));
});

gulp.task('clean-dist-js', function () {
	return gulp.src(dist + '/js/', {read: false})
			.pipe(clean());
});

gulp.task('clean-dist-css', function () {
	return gulp.src(dist + '/css/', {read: false})
			.pipe(clean());
});

gulp.task('clean-dist', function () {
	return gulp.src(dist + '/', {read: false})
			.pipe(clean());
});

gulp.task('compress-js', ['js-min'], function() {
		gulp.src(dist + '/js/*')
		.pipe(tar('js.tar'))
		.pipe(gzip())
		.pipe(gulp.dest(dist));
});

gulp.task('tar',  function() {
	gulp.src(dist + '/html/**/**')
	.pipe(tar('htdocs.tar'))
	.pipe(gzip())
	.pipe(gulp.dest(dist));
});

// 创建多层目录
function mkdirs(dirname, mode, callback) {
    fs.exists(dirname, function (exists) {
        if(exists){
            callback();
        }else{
            //console.log(path.dirname(dirname));
            mkdirs(path.dirname(dirname), mode, function (){
                fs.mkdir(dirname, mode, callback);
            });
        }
    });
}

// 拷贝文件
function copyfile(oldPath, newPath) {
    console.log('复制'+oldPath+' -> '+newPath);
    
    var stat = fs.lstatSync(oldPath);
    if(stat.isDirectory()) {
        console.log(oldPath+'是目录');
        return false;
    }
    
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);
    readStream.pipe(writeStream);
    readStream.on('end', function () {
        console.log('copy end');
    });
    readStream.on('error', function () {
        console.log('copy error');
    });
}

// 监听任务 运行语句 gulp watch
gulp.task('watch',function() {
    server.listen(port, function(err){
        if (err) {
            return console.log(err);
        }
        
        //拷贝修改过的文件
        gulp.watch('src/**/**', function(e) {
            console.log(e);
            var oldPath = e.path;
            var newPath = oldPath.replace('\\src\\', '\\dist\\');
            var newDirPathTemp = newPath.split("\\");
            var currentPath = fs.realpathSync('.');
            var newDirPath = [];
            for(var i = 0; i < newDirPathTemp.length-1; i++) {
                newDirPath[i] = newDirPathTemp[i];
            }
            newDirPath = newDirPath.join("\\");
            newDirPath = newDirPath.replace(currentPath, '');
            newDirPath = newDirPath.replace(/\\/g, "/");
            newDirPath = newDirPath.replace("/", "./");
            //console.log('当前路径'+newDirPath);
            
            // 修改或增加时
            if('added' == e.type || 'changed' == e.type || 'renamed' == e.type) {
                // 判断目录是否存在，不存在则创建
                fs.exists(newDirPath, function(exists) { 
                    if(exists){ 
                        //console.log("文件夹存在");
                        copyfile(oldPath, newPath);
                    } else {
                        //console.log("文件夹不存在，则创建目录");
                        mkdirs(newDirPath);
                        
                        // 延时，等待目录创建完成
                        setTimeout(function(){
                            copyfile(oldPath, newPath);
                        }, 200);
                    }
                });
            } else if('deleted' == e.type) { // 删除
                fs.unlink(newPath, function(err){
                    console.log('删除'+newPath+err);
                });
            }
        });

        // // 监听sass
        // gulp.watch('src/css/*.scss', function(){
        //     gulp.run('sass');
        // });

        // // 监听js
        // gulp.watch('./src/js/*.js', function(){
        //     gulp.run('js');
        // });
        
        // // 监听html
        // gulp.watch('./src/*.php', function(){
        //     gulp.run('html');
        // });
        
    });

});



//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function(){
	return gulp.src(src + '/css/*.css')
		.pipe(gulp.dest(dist + '/css'))
		.pipe(rev())
		.pipe(gulp.dest(dist + '/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});


//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
/* 

gulp.src(['assets/css/*.css', 'assets/js/*.js'], {base: 'assets'})
        .pipe(gulp.dest('build/assets'))  // copy original assets to build dir
        .pipe(rev())
        .pipe(gulp.dest('build/assets'))  // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/assets')) 

*/
gulp.task('revJs', function(){
	return gulp.src(src + '/js/*.js')
		.pipe(gulp.dest(dist + '/html/js'))
		.pipe(rev())
		.pipe(gulp.dest(dist + '/html/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});

//Html替换css、js文件版本
gulp.task('revHtml', function () {
    return gulp.src(['rev/**/*.json', src + '/html/*.html'] )
        .pipe(revCollector())
        .pipe(gulp.dest(dist + '/html'));
});

//开发构建
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
        ['revCss'],
        ['revJs'],
		['revHtml'],
		['tar'],
        done);
});