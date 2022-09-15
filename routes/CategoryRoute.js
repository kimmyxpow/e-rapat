const express = require('express')
const router = express.Router()
const CategoryController = require('../app/controller/CategoryController.js')
const authorization = require('../middlewares/authorization.js')
const isAdmin = require('../middlewares/isAdmin.js')

router.get('/:institute', CategoryController.index)

router.post(
    '/:institute',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isAdmin(req, res, authUser.id)
        next()
    },
    CategoryController.store
)

router.put(
    '/:institute/:id',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isAdmin(req, res, authUser.id)
        next()
    },
    CategoryController.update
)

router.delete(
    '/:institute/:id',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isAdmin(req, res, authUser.id)
        next()
    },
    CategoryController.destroy
)

module.exports = router
