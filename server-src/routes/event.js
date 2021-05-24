const express = require('express')
const Event = require('../model/Event')

const router = express.Router()

const datesCompare = (date, reqDate) => {
    const eventDate = new Date(date)
    const reqEventDate = new Date(reqDate)
    return eventDate.getFullYear() === reqEventDate.getFullYear()
        && eventDate.getMonth() === reqEventDate.getMonth()
        && eventDate.getDate() === reqEventDate.getDate()
}

//add event
router.post('/add', async (req, res) => {
    const data = req.body

    //Create a new event
    const event = new Event(data)

    await event.save()

    res.json({
        message: 'Event successfully added!',
        data: event
    })
})

//get Event
router.post('/:userId', async (req, res) => {
    const {date} = req.body
    const {year} = req.body

    const events = await Event.find({userId: req.params.userId})
    if (!events) return res.json({message: 'Event are not found'})

    res.json({
        data: date ? events.filter(event => datesCompare(event.date, date)) : events.filter(event => event.date.getFullYear() === year)
    })
})


module.exports = router
