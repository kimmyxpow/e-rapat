const { Types } = require('mongoose')
const User = require('../../app/model/User.js')
const Hash = require('../../app/utility/Hash')
const jwt = require('jsonwebtoken')

async function login(req, res, next) {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) return res.json({ message: "Login failed", success: false, }, 401)

        const checkPassword = Hash.compare(password, user.password)

        if (!checkPassword) return res.json({ message: "Login failed", success: false, }, 401)

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            token,
            user,
            success: true,
        })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

module.exports = {
    login
}
