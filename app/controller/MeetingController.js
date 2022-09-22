const { Types } = require('mongoose')
const Meeting = require('../../app/model/Meeting.js')
const Participant = require('../../app/model/Participant.js')
const Validator = require('../utility/Validator.js')
const UploadFile = require('../utility/UploadFile.js')
const fs = require('fs')

async function all(req, res, next) {
    try {
        const { search, date, institute } = req.query
        const meetings = Meeting.find()

        if (search) meetings.find({ event: { $regex: search, $options: 'i' } })
        if (date) meetings.where({ date }).sort({ time: 'asc' })
        if (institute) meetings.where({ user: institute }).sort({ time: 'asc' })

        res.json({
            meetings: await meetings
                .populate('user')
                .sort({ createdAt: 'asc' }),
            success: true,
        })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function participants(req, res, next) {
    try {
        const { search } = req.query
        const participants = Participant.find({
            meeting: req.params.meeting,
        })

        if (search)
            participants.find({
                name: { $regex: search, $options: 'i' },
            })

        res.json({
            participants: await participants.sort({ name: 'asc' }),
            success: true,
        })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function index(req, res, next) {
    try {
        const { search, date } = req.query
        const meetings = Meeting.find().where({ user: req.params.institute })

        if (search) meetings.find({ event: { $regex: search, $options: 'i' } })

        if (date) meetings.where({ date }).sort({ time: 'asc' })

        res.json({
            meetings: await meetings
                .populate('user')
                .sort({ createdAt: 'asc' }),
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

        let errorBag = await Validator(payload, {
            event: ['required', 'min:3'],
            date: ['required', 'date'],
            time: ['required'],
            place: ['required', 'min:3'],
        })

        if (!req.files)
            errorBag = { ...errorBag, rundown: 'Rundown image is required' }

        if (Object.keys(errorBag).length > 0) {
            return res.json({ error: errorBag, success: false })
        }

        const rundown = UploadFile.store(
            req.files.rundown,
            '/public/uploads/rundown'
        )

        await Meeting.create({
            ...payload,
            _id: new Types.ObjectId(),
            user: req.params.institute,
            rundown,
        })

        return res.json({
            message: 'Meeting created successfuly',
            success: true,
        })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function show(req, res, next) {
    try {
        const meeting = await Meeting.findById(req.params.meeting).populate(
            'user'
        )

        res.json({
            meeting,
            success: true,
        })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function update(req, res, next) {
    try {
        let payload = req.body
        const meeting = await Meeting.findById(req.params.id)

        const errorBag = await Validator(payload, {
            event: ['required', 'min:3'],
            date: ['required', 'date'],
            time: ['required'],
            place: ['required', 'min:3'],
        })

        if (Object.keys(errorBag).length > 0) {
            return res.json({ error: errorBag, success: false })
        }

        if (req.files) {
            const rundown = UploadFile.store(
                req.files.rundown,
                '/public/uploads/rundown'
            )
            UploadFile.destroy('public/uploads/rundown/' + meeting.rundown)
            payload = { ...payload, rundown }
        }

        await meeting.updateOne(payload)

        return res.json({
            message: 'Meeting updated successfuly',
            success: true,
        })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function destroy(req, res, next) {
    try {
        const meeting = await Meeting.findByIdAndDelete(req.params.id)
        UploadFile.destroy('public/uploads/rundown/' + meeting.rundown)
        return res.json({
            message: 'Meeting deleted successfuly',
            success: true,
        })
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
    all,
    participants,
    show,
}
