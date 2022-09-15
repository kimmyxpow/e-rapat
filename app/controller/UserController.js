const { Types } = require('mongoose')
const User = require('../../app/model/User.js')
const authorization = require('../../middlewares/authorization.js')
const isSuperAdmin = require('../../middlewares/isSuperAdmin.js')
const Hash = require('../utility/Hash.js')
const Validator = require('../utility/Validator')

async function index(req, res, next) {
    try {
        const { search } = req.query
        const users = User.where({ role: 'admin' })

        if (search) {
            users.find({
                name: { $regex: search, $options: 'i' },
                email: { $regex: search, $options: 'i' },
            })
        }

        res.json({ users: await users.sort({ name: 'asc' }), success: true })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function store(req, res, next) {
    try {
        const payload = req.body

        const errorBag = await Validator(payload, {
            email: ['required', 'email', 'unique:User'],
            password: ['required', 'password'],
            name: ['required', 'min:3'],
            address: ['required', 'min:3'],
            // role: ['required'],
        })

        if (Object.keys(errorBag).length > 0) {
            return res.json({ error: errorBag, success: false })
        }

        payload.password = Hash.make(payload.password)

        await User.create({ ...payload, _id: new Types.ObjectId() })

        return res.json({ message: 'User created successfuly', success: true })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function update(req, res, next) {
    try {
        const payload = req.body
        const user = await User.findById(req.params.id)
        const rules = {
            email: ['required', 'email', `unique:User,${user.email}`],
            name: ['required', 'min:3'],
            address: ['required', 'min:3'],
            role: ['required'],
        }

        if (payload.password) {
            rules.password = ['password']
        }

        const errorBag = await Validator(payload, rules)

        if (Object.keys(errorBag).length > 0) {
            return res.json({ error: errorBag, success: false })
        }

        payload.password =
            payload.password != null
                ? Hash.make(payload.password)
                : user.password

        await user.updateOne(payload)

        return res.json({ message: 'User updated successfuly', success: true })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function show(req, res, next) {
    try {
        const user = await User.findById(req.params.user)

        res.json({
            user,
            success: true,
        })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function destroy(req, res, next) {
    try {
        await User.findByIdAndDelete(req.params.id)
        return res.json({ message: 'User deleted successfuly', success: true })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

module.exports = {
    index,
    store,
    update,
    destroy,
    show,
}
