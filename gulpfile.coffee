gulp = require "gulp"
coffee = require "gulp-coffee"
gutil = require "gulp-util"
clean = require "gulp-clean"
through2 = require "through2"
fs = require "fs"
gulpsync = require("gulp-sync") gulp
argv = require('yargs').argv
karma = require('karma').server

version = "0.0.0"
try
  pkg = JSON.parse fs.readFileSync("package.json")
  version = pkg?.version or version

console.log version

PATH =
  coffee: "./src/*.coffee"
  build: "./dist/"
  test: "./test/*.coffee"
  version: ["bower.json", "package.json"]
  coverage: "./coverage"

gulp.task "test", ["clean:coverage"], (done)->
  karma.start {
    configFile: __dirname + '/karma.conf.js'
    singleRun: true
  }, done

gulp.task "clean:coverage", ->
  gulp.src PATH.coverage, {read: false}
    .pipe clean()


gulp.task "clean", ->
  gulp.src PATH.build, {read: false}
    .pipe clean()

version_coffee = through2.obj (file, enc, calback)->
  file.contents = new Buffer file.contents.toString().replace(
    /\.version[ ]*=[ ]*[\'\"]([0-9\.]+)[\'\"]/g,
    ".version = \"#{version}\""
  )
  fs.writeFile file.path, file.contents, (err)=>
    @push file
    calback(err)

gulp.task "coffee", ->
  gulp.src PATH.coffee
    .pipe version_coffee
    .pipe coffee({bare: false}).on("error", gutil.log)
    .pipe gulp.dest(PATH.build)


gulp.task "version", ->
  gulp.src PATH.version
    .pipe through2.obj (file, enc, calback)->
      if file.isBuffer() or file.isFile()
        try
          pkg = JSON.parse file.contents
          pkg.version = version
          file.contents = new Buffer JSON.stringify(pkg, null, 2)
        @push file
      calback()
    .pipe gulp.dest(".")

gulp.task "default", gulpsync.sync [
  "clean"
  "version"
  "coffee"
  "test"
]
