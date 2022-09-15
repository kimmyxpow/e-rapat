const express = require('express')
const router = express.Router()
const UserController = require('../app/controller/UserController.js')
const authorization = require('../middlewares/authorization.js')
const isSuperAdmin = require('../middlewares/isSuperAdmin.js')

router.get('/', UserController.index)

router.get(
    '/show/:user',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isSuperAdmin(req, res, authUser.id)
        next()
    },
    UserController.show
)

router.post(
    '/',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isSuperAdmin(req, res, authUser.id)
        next()
    },
    UserController.store
)

router.put(
    '/:id',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isSuperAdmin(req, res, authUser.id)
        next()
    },
    UserController.update
)

router.delete(
    '/:id',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isSuperAdmin(req, res, authUser.id)
        next()
    },
    UserController.destroy
)

module.exports = router
