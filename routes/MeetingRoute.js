const express = require('express')
const router = express.Router()
const MeetingController = require('../app/controller/MeetingController.js')
const authorization = require('../middlewares/authorization.js')
const isAdmin = require('../middlewares/isAdmin.js')
const isSuperAdmin = require('../middlewares/isSuperAdmin.js')

router.get(
    '/',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isSuperAdmin(req, res, authUser.id)
        next()
    },
    MeetingController.all
)

router.get(
    '/participants/:meeting',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isSuperAdmin(req, res, authUser.id)
        next()
    },
    MeetingController.participants
)

router.get(
    '/:institute',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isAdmin(req, res, authUser.id)
        next()
    },
    MeetingController.index
)

router.post(
    '/:institute/',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isAdmin(req, res, authUser.id)
        next()
    },
    MeetingController.store
)

router.put(
    '/:institute/:id',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isAdmin(req, res, authUser.id)
        next()
    },
    MeetingController.update
)

router.delete(
    '/:institute/:id',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isAdmin(req, res, authUser.id)
        next()
    },
    MeetingController.destroy
)

module.exports = router
