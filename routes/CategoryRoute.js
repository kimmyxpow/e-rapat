const express = require('express')
const router = express.Router()
const CategoryController = require('../app/controller/CategoryController.js')
const authorization = require('../middlewares/authorization.js')
const isAdmin = require('../middlewares/isAdmin.js')

router.use(async (req, res, next) => {
    const authUser = await authorization(req, res)
    await isAdmin(req, res, authUser.id)
    next()
})

router.get('/:institute', CategoryController.index)

router.post('/:institute', CategoryController.store)

router.put('/:institute/:id', CategoryController.update)

router.delete('/:institute/:id', CategoryController.destroy)

module.exports = router
