const fs = require('fs')
const { cwd } = require('process')
const randomstring = require('randomstring')

const store = (file, path) => {
    if (!fs.existsSync(cwd() + path)) {
        fs.mkdirSync(cwd() + path, { recursive: true })
    }
    
    const fileName =
        randomstring.generate() + Date.now() + '.' + file.mimetype.split('/')[1]
    const upload = cwd() + path + '/' + fileName

    file.mv(upload)

    return fileName
}

const destroy = (file) => {
    fs.unlinkSync(file)

    return file
}

module.exports = { store, destroy }
