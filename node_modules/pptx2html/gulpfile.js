'use strict'

const babel = require('rollup-plugin-babel')
const buffer = require('vinyl-buffer')
const commonJs = require('rollup-plugin-commonjs')
const gulp = require('gulp')
const merge = require('merge-stream')
const nodeResolve = require('rollup-plugin-node-resolve')
const rollup = require('rollup-stream')
const source = require('vinyl-source-stream')
const jetpack = require('fs-jetpack')
const composer = require('gulp-uglify/composer')
const uglifyES = require('uglify-es')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')

const minify = composer(uglifyES, console)
const destDir = jetpack.cwd('./dist')

const jsFiles = [
  {path: 'src/main.js', name: 'pptx2html.js'},
  {path: 'src/worker.js', name: 'pptx2html_worker.js'}
]

gulp.task('clean', () =>
  destDir.dir('.', {empty: true})
)

const buildClientJsFile = (filePath, fileName, destPath) =>
  rollup({
    input: filePath,
    format: 'iife',
    name: 'pptx2html',
    plugins: [
      babel({
        exclude: 'node_modules/core-js/**',
        presets: [
          ['@babel/preset-env',
            {
              useBuiltIns: 'usage',
              modules: false
            }
          ]
        ]
      }),
      nodeResolve({
        module: true,
        main: true
      }),
      commonJs({
        include: 'node_modules/**',
        sourceMap: true
      })
    ],
    sourcemap: true
  })
    .pipe(source(fileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destPath))
    .on('error', console.error.bind(console))

gulp.task('build', ['clean'], () =>
  merge(jsFiles.map(({path, name}) => buildClientJsFile(path, name, destDir.path())))
)

gulp.task('build-full', ['build'], () => destDir.write(
  'pptx2html.full.js',
  [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/jszip/dist/jszip.min.js',
    './node_modules/d3/build/d3.min.js',
    './node_modules/dimple/dist/dimple.latest.min.js',
    destDir.path('pptx2html.js')
  ]
    .map(filePath => jetpack.read(filePath))
    .join(';'))
)

gulp.task('minify', ['build-full'], () =>
  gulp.src('dist/**/*.js')
    .pipe(rename(p => { p.extname = '.min.js' }))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(minify({
      compress: {
        passes: 2,
        typeofs: false
      },
      ie8: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destDir.path()))
    .on('error', console.error.bind(console))
)
