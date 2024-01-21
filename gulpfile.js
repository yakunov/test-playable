const { src, dest, watch } = require('gulp');
const { series } = require('gulp');
const webpack = require('webpack-stream');
const inject = require('gulp-inject');

const ConverterBase64 = require('./build_tools/ConverterBase64')

function packCode(cb) {
  return src('./src/**/*.js')
      .pipe(webpack(
        {optimization: {
          minimize: true,
        }
      }
      ))
      .pipe(dest('./packed/'))
      .on('error', function() {
          cb(new Error('Test failed'));
      })
      .on('end', function() {
          cb();
      });
}

function injectCode(cb) {
  let target = src('./src/template/index.html');
  let sources = src(['./packed/**/*.js']);
  let params = {
    transform: function(filepath, file) {
      return '<script>' + file.contents.toString() + '</script>';
    }
  }

  return target.pipe(inject(sources, params))
    .pipe(dest('./build'))
    .on('error', function() {
      cb(new Error('Test failed'));
    })
    .on('end', function() {
        cb();
    });
}

exports.packImages = ConverterBase64.convertImages
exports.buildCode = series(packCode, injectCode)
exports.default = series(exports.packImages, exports.buildCode)
