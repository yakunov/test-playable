const { promisify } = require('util');
const { resolve } = require('path');
const path = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const imageToBase64 = require('image-to-base64');

const LANG = 'en'

class ConverterBase64 {

  static async convertImages() {
    const commonFiles = await ConverterBase64.getFiles('./src/images/common')
    const textFiles = await ConverterBase64.getFiles(`./src/images/langs/${LANG}`)
    const files = commonFiles.concat(textFiles)

    const fileReaders = []
    for (let file of files) {
      fileReaders.push(
        imageToBase64(file.path)
        .then(
            (data) => {
              file.data = 'data:image/png;base64,' + data
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
      )
    }

    if (! fs.existsSync('./packed')) fs.mkdirSync('./packed');

    Promise.all(fileReaders).then(() => {
      fs.writeFile('./packed/images.js', 'window.images = ' + ConverterBase64.dataToJson(files), error => {
        if (error) {
          console.error(error);
        }
      });
    })
  }

  static dataToJson(files) {
    const obj = {}
    for (let file of files) {
      obj[file.key] = file.data
    }
    return JSON.stringify(obj)
  }

  static async getFiles(dir) {
    const dirLength = resolve(dir).split(path.sep).length
    const paths = await ConverterBase64.getPaths(dir)
    const files = []
    for (let p of paths) {
      const keyParts = path.dirname(p).split(path.sep).slice(dirLength)
      keyParts.push(path.basename(p, path.extname(p)))

      files.push({
        path: p,
        key: keyParts.join('/')
      })
    }
    return files
  }

  static async getPaths(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? ConverterBase64.getPaths(res) : res;
    }));
    let res = files.reduce((allFiles, file) => allFiles.concat(file), []);
    return res
  }

}

module.exports = ConverterBase64;