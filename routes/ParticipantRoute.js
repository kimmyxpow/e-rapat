const express = require('express')
const router = express.Router()
const ParticipantController = require('../app/controller/ParticipantController.js')
const authorization = require('../middlewares/authorization.js')
const isAdmin = require('../middlewares/isAdmin.js')

router.use(async (req, res, next) => {
    const authUser = await authorization(req, res)
    await isAdmin(req, res, authUser.id)
    next()
})

router.get('/:meeting', ParticipantController.index)

router.post('/:meeting', ParticipantController.store)

router.put('/:id/in', ParticipantController.checkIn)

router.put('/:id/out', ParticipantController.checkOut)

module.exports = router
