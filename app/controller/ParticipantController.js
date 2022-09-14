const moment = require('moment/moment.js')
const Participant = require('../../app/model/Participant.js')
const Validator = require('../utility/Validator.js')

async function index(req, res, next) {
    try {
        const { search } = req.query
        const participant = Participant.find().where({
            meeting: req.params.meeting,
        })

        if (search) {
            participant.find({
                name: { $regex: search, $options: 'i' },
                email: { $regex: search, $options: 'i' },
            })
        }

        res.json({
            participant: await participant
                .populate('meeting')
                .populate('user')
                .populate('category')
                .sort({ name: 'asc' }),
            success: true,
        })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function store(req, res, next) {
    try {
        const payload = req.body

        const errorBag = await Validator(payload, {
            category: ['required'],
            user: ['required'],
            name: ['required', 'min:3'],
            email: ['required', 'email'],
            phone: ['required', 'phone'],
        })

        if (Object.keys(errorBag).length > 0) {
            return res.json({ error: errorBag, success: false })
        }

        const participant = await Participant.create({
            ...payload,
            meeting: req.params.meeting,
        })

        return res.json({ message: 'Register success', success: true })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function checkIn(req, res, next) {
    try {
        const checkIn = moment().format('YYYY-MM-DD HH:ss')
        const category = await Participant.findById(req.params.id)

        const errorBag = await Validator(req.body, {
            meeting: ['required'],
        })

        if (Object.keys(errorBag).length > 0) {
            return res.json({ error: errorBag, success: false })
        }

        await category.updateOne({ in: checkIn })

        return res.json({ message: 'Check in success', success: true })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function checkOut(req, res, next) {
    try {
        const checkOut = moment().format('YYYY-MM-DD HH:ss')
        const category = await Participant.findById(req.params.id)

        const errorBag = await Validator(req.body, {
            meeting: ['required'],
        })

        if (Object.keys(errorBag).length > 0) {
            return res.json({ error: errorBag, success: false })
        }

        await category.updateOne({ out: checkOut })

        return res.json({ message: 'Check out success', success: true })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

module.exports = {
    index,
    store,
    checkIn,
    checkOut,
}
