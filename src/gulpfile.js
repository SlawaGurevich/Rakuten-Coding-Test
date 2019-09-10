const { series, src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const sync = require('browser-sync');
const mini = require('gulp-uglify-es').default;
const concat = require('gulp-concat');

function styles() {
	return src('scss/**/*.scss')
		.pipe(sass())
		.pipe(dest('../app/css'))
		.pipe(sync.stream());
}

function scripts() {
	return src(['scripts/model.js', 'scripts/view.js', 'scripts/controller.js', 'scripts/scripts.js'])
		.pipe(mini())
		.pipe(concat('scripts.js'))
		.pipe(dest('../app/js'))
		.pipe(sync.stream());
}

function watcher(cb) {
	sync.init({
		proxy: "localhost/rakuten",
	});
	cb();
}

watch(['scss/**/*.scss'], styles);

watch(['scripts/**/*.js'], scripts);

watch(['../**/*.html'], function(cb) {
	sync.reload();
	cb();
});

exports.default = series(styles, scripts, watcher);