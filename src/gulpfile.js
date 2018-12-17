var gulp = require('gulp');
/**
 * 插件名：gulp-rev
 * 问题：若改变了文件内容，但不改变文件名，重新发布到服务器时，在用户浏览器会有缓存。若手动维护版本号，操作复杂且容易出错
 * 简述：为静态文件随机添加一串hash值, 解决cdn缓存问题
 * 详见：给每个文件添加版本号，根据文件内容计算文件的哈希码，一旦文件改变，会重新生成哈希码，文件名称也随之改变
 **/
var rev = require('gulp-rev');
/**
 * 插件名：gulp-rev-replace
 * 问题：根据rev生成的manifest.json文件中的映射, 去替换文件名称, 也可以替换路径
 **/
var revReplace = require('gulp-rev-replace')
/**
 * 插件名：gulp-useref
 * 详见：通过注释的方式，告诉gulp哪些文件需要合并
 **/
var useref = require('gulp-useref')
/**
 * 插件名：gulp-filter
 * 详见：过滤器，在虚拟文件流中过滤特定的文件
 **/
var filter = require('gulp-filter');
/**
 * 插件名：gulp-uglify
 * 详见：压缩js代码
 **/
var uglify = require('gulp-uglify');
/**
 * 插件名：gulp-csso
 * 详见：压缩css代码
 **/
var csso = require('gulp-csso')

gulp.task('default', function () {
    var jsFilter = filter('**/*.js', {restore: true});
    var cssFilter = filter('**/*.css', {restore: true});
    var indexHtmlFilter = filter(['**/*', '!**/index.html'], {restore: true});

    return gulp.src('./index.html') // 引入需要处理的文件
        .pipe(useref()) // 分析index文件中带有<!-- build: --><!-- endbuild -->注释标志的文件，会将注释标志中的文件放到文件流中，就不需要在src中引入
        .pipe(jsFilter) // 从文件流中筛选js文件
        .pipe(uglify()) // 压缩js文件
        .pipe(jsFilter.restore) // 返回文件流
        .pipe(cssFilter) // 从文件流中筛选css文件
        .pipe(csso()) // 压缩css文件
        .pipe(cssFilter.restore) // 返回文件流
        .pipe(indexHtmlFilter) // 从文件流中筛选全部文件（排除index.html文件）
        .pipe(rev()) // 为文件重命名为带版本号的名称
        .pipe(indexHtmlFilter.restore) // 返回文件流
        .pipe(revReplace()) // 将index中对文件的引用进行更新
        .pipe(gulp.dest('dist')) // 将文件流保存到dist目录
})
