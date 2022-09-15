const express = require('express')
const router = express.Router()
const ParticipantController = require('../app/controller/ParticipantController.js')
const authorization = require('../middlewares/authorization.js')
const isAdmin = require('../middlewares/isAdmin.js')

router.get(
    '/:meeting',
    async (req, res, next) => {
        const authUser = await authorization(req, res)
        await isAdmin(req, res, authUser.id)
        next()
    },
    ParticipantController.index
)

router.post('/:meeting', ParticipantController.store)

router.get('/show/:id', ParticipantController.show)

router.put('/:id/in', ParticipantController.checkIn)

router.put('/:id/out', ParticipantController.checkOut)

module.exports = router
