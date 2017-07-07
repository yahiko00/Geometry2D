// gulpfile.js

const packageJson = require("./package.json");
const mainFilename = packageJson.main;
const settings = packageJson.settings;
const gulp = require("gulp");
const del = require("del");
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const gutil = require("gulp-util");
const changed = require("gulp-changed");
const runSequence = require("run-sequence");
const tape = require("gulp-tape");
const through = require("through2");
const fs = require("fs");
const merge = require("merge2");
const rename = require("gulp-rename");
const exorcist = require("exorcist");
const transform = require('vinyl-transform');

const debug = settings.debug === true;

if (debug) { console.log("=== DEBUG Environment ===") }
else { console.log("=== RELEASE Environment ==="); }

// Clean destination directory
gulp.task("clean", () => {
    let files = ["./.cache.json", "./*.log"];
    if (debug) { files.push(settings.paths.debug + "*"); }
    else {
        files.push(settings.paths.release + mainFilename);
        files.push(settings.paths.release + mainFilename + ".map");
        files.push(settings.paths.release + "index.d.ts");
    }

    return del(files);
});

// Clean destination directory for all environnements
gulp.task("clean:all", () => {
    let files = ["./.cache.json", "./*.log"];
    files.push(settings.paths.debug + "*");
    files.push(settings.paths.release + mainFilename);
    files.push(settings.paths.release + mainFilename + ".map");
    files.push(settings.paths.release + "index.d.ts");

    return del(files);
});

// Compile TypeScript files
gulp.task("compile", () => {
    let config = "";
    let dest = "";

    if (debug) {
        config = settings.tsconfig.debug;
        dest = settings.paths.debug;
    }
    else {
        config = settings.tsconfig.release;
        dest = settings.paths.release;
    }

    const tsProject = ts.createProject(config);
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return merge([
        tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(dest)),
        tsResult.dts
            .pipe(rename("index.d.ts"))
            .pipe(gulp.dest(dest))])
        .on("error", gutil.log);
});

// Minify JavaScript files
gulp.task("minify", ["compile"], () => {
    let dest = "";

    if (debug) { dest = settings.paths.debug;  }
    else { dest = settings.paths.release; }

    return gulp.src([dest + "*.js", "!" + dest + "gulpfile.js"])
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(transform(function () { return exorcist(dest + mainFilename + ".map"); }))
        .pipe(gulp.dest(dest))
        .on("error", gutil.log);
});

// Rebuild on change
gulp.task("watch", () => {
    runSequence(["minify"], "test");
    gulp.watch(settings.paths.src + "**", () => {
        runSequence(["minify"], "test");
    });
});

// Default task
gulp.task("default", ["minify"]);

// Unit tests
gulp.task("test", () => {
    if (!debug) return;

    process.stdout.write("\x1Bc");
    const reporter = through.obj();
    reporter
        .pipe(process.stdout);

    return gulp.src(settings.paths.tests + "*.js")
        .pipe(tape({
            "bail": false,
            "outputStream": fs.createWriteStream(settings.paths.tests + "tape.log"),
            "reporter": reporter
        }));
});
