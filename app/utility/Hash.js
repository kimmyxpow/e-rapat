const bcrypt = require('bcryptjs')

const make = (val) => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(val, salt)
}

const compare = (val, hash) => {
    return bcrypt.compareSync(val, hash)
}

module.exports = Hash = { make, compare }
