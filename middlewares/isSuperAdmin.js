const User = require('../app/model/User')

const isSuperAdmin = (req, res, id) => {
    return new Promise(async (resolve, reject) => {
        const user = await User.findById(id)

        if (user.role != 'super_admin') return res.status(403).end()

        return resolve(user)
    })
}

module.exports = isSuperAdmin
