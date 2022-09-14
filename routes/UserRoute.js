const express = require('express')
const router = express.Router()
const UserController = require('../app/controller/UserController.js')
const authorization = require('../middlewares/authorization.js')
const isSuperAdmin = require('../middlewares/isSuperAdmin.js')

router.use(async (req, res, next) => {
    const authUser = await authorization(req, res)
    await isSuperAdmin(req, res, authUser.id)
    next()
})

router.get('/', UserController.index)

router.post('/', UserController.store)

router.put('/:id', UserController.update)

router.delete('/:id', UserController.destroy)

module.exports = router
