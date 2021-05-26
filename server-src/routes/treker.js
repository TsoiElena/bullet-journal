const express = require('express')
const Treker = require('../model/Treker')

const router = express.Router()

const datesCompare = (date, reqDate) => {
    const trekerDate = new Date(date)
    const reqTrekerDate = new Date(reqDate)
    return trekerDate.getFullYear() === reqTrekerDate.getFullYear()
        && trekerDate.getMonth() === reqTrekerDate.getMonth()
        && trekerDate.getDate() === reqTrekerDate.getDate()
}

const compareMonthDate = (date, reqDate) => {
    const trekerDate = new Date(date)
    const reqTrekerDate = new Date(reqDate)
    return trekerDate.getFullYear() === reqTrekerDate.getFullYear()
        && trekerDate.getMonth() === reqTrekerDate.getMonth()
}

//add treker
router.post('/add', async (req, res) => {
    const data = req.body

    //Create a new treker
    const treker = new Treker(data)

    await treker.save()

    res.json({
        message: 'Treker successfully added!',
        data: treker
    })
})

//getTreker
router.post('/:userId', async (req, res) => {
    const {date} = req.body

    const trekers = await Treker.find({userId: req.params.userId})
    if (!trekers) return res.json({message: 'Treker are not found'})

    res.json({
        data: trekers.filter(treker => compareMonthDate(treker.date, date))
    })
})

//getTreker for day
router.post('/day/:userId', async (req, res) => {
    const {date} = req.body

    const trekers = await Treker.find({userId: req.params.userId})
    if (!trekers) return res.json({message: 'Treker are not found'})

    res.json({
        data: trekers.filter(treker => datesCompare(treker.date, date))
    })
})

//change task status
router.patch('/', async (req, res) => {
    const {trekerId} = req.body
    const {date} = req.body

    //Create a new task
    const treker = await Treker.findById(trekerId)
    const newDay = {
        date: new Date(date),
        isReady: true
    }
    treker.days.push(newDay)
    treker.save()

    await treker.save(async (err) => {
        if (err) return res.json({message: err})
    })

    res.json({
        message: 'Treker successfully changed!',
        data: {
            changedTrekerId: treker._id,
            newDay
        }
    })
})

module.exports = router
