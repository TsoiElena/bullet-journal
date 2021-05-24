const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../model/User')

const router = express.Router()


//REGISTRATION
router.post('/registration', async (req, res) => {
    const data = req.body

    const salt = await bcrypt.genSalt(7)
    data.password = await bcrypt.hash(req.body.password, salt)

    //Create a new user
    const user = new User(data)

    await user.save()

    res.json({
        message: 'Registration success!',
        data: user
    })
})

//LOGIN
router.post('/login', async (req, res) => {

    //Checking if the email exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(401).json({ message: 'Email is not found' })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(401).json({ message: 'Invalid password' })

    res.json({
        message: 'Authorization success!',
        data: user
    })
})

module.exports = router
