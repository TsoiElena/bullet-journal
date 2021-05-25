const express = require('express')
const Task = require('../model/Task')

const router = express.Router()

const datesCompare = (date, reqDate) => {
    const taskDate = new Date(date)
    const reqTaskDate = new Date(reqDate)
    return taskDate.getFullYear() === reqTaskDate.getFullYear()
        && taskDate.getMonth() === reqTaskDate.getMonth()
        && taskDate.getDate() === reqTaskDate.getDate()
}

const compareMonthDate = (date, reqDate) => {
    const taskDate = new Date(date)
    const reqTaskDate = new Date(reqDate)
    return taskDate.getFullYear() === reqTaskDate.getFullYear()
    && taskDate.getMonth() === reqTaskDate.getMonth()
}

//add task
router.post('/add', async (req, res) => {
    const data = req.body

    //Create a new task
    const task = new Task(data)

    await task.save()

    res.json({
        message: 'Task successfully added!',
        data: task
    })
})

//getTask
router.post('/:userId', async (req, res) => {
    const {date} = req.body
    const {year} = req.body

    const tasks = await Task.find({userId: req.params.userId})
    if (!tasks) return res.json({message: 'Task are not found'})

    res.json({
        data: date ? tasks.filter(task => datesCompare(task.date, date)) : tasks.filter(task => task.date.getFullYear() === year)
    })
})

//getTask month
router.post('/month/:userId', async (req, res) => {
    const {date} = req.body

    const tasks = await Task.find({userId: req.params.userId})
    if (!tasks) return res.json({message: 'Task are not found'})

    res.json({
        data: tasks.filter(task => compareMonthDate(task.date, date))
    })
})

//change task status
router.patch('/', async (req, res) => {
    const {taskId, taskStatus} = req.body

    //Create a new task
    const task = await Task.findById(taskId)
    task.isReady = taskStatus
    task.save()

    await task.save(async (err) => {
        if (err) return res.json({message: err})
    })

    res.json({
        message: 'Task successfully changed!',
        data: task
    })
})

module.exports = router
