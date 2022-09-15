const { Types } = require('mongoose')
const Category = require('../../app/model/Category.js')
const Validator = require('../utility/Validator.js')

async function index(req, res, next) {
    try {
        const { search } = req.query
        const categories = Category.find().where({ user: req.params.institute })

        if (search) categories.find({ name: { $regex: search, $options: 'i' } })

        res.json({
            categories: await categories.populate('user').sort({ name: 'asc' }),
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
            name: ['required', 'min:3'],
        })

        if (Object.keys(errorBag).length > 0) {
            return res.json({ error: errorBag, success: false })
        }

        await Category.create({
            ...payload,
            _id: new Types.ObjectId(),
            user: req.params.institute,
        })

        return res.json({
            message: 'Category created successfuly',
            success: true,
        })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function update(req, res, next) {
    try {
        const payload = req.body
        const category = await Category.findById(req.params.id)

        const errorBag = await Validator(payload, {
            name: ['required', 'min:3'],
        })

        if (Object.keys(errorBag).length > 0) {
            return res.json({ error: errorBag, success: false })
        }

        await category.updateOne(payload)

        return res.json({
            message: 'Category updated successfuly',
            success: true,
        })
    } catch (err) {
        console.error('Error', err.message)
        next(err)
    }
}

async function destroy(req, res, next) {
    try {
        await Category.findByIdAndDelete(req.params.id)
        return res.json({
            message: 'Category deleted successfuly',
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
}
