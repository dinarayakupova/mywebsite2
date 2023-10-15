const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

class FileService {
  file

  constructor (file) {
    this.file = file
  }

  createFile (file) {
    try {
      const fileExtension = file.originalname.split('.').pop()
      const fileName = uuid.v4() + '.' + fileExtension
      const filePath = path.resolve(__dirname, '..', 'static', 'image')
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true })
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)
      return 'image' + '/' + fileName
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = FileService
