const express = require('express')
const Film = require('../model/Film')

const router = express.Router()

//add film
router.post('/add', async (req, res) => {
    const data = req.body

    //Create a new task
    const film = new Film(data)

    await film.save()

    res.json({
        message: 'Film successfully added!',
        data: film
    })
})

//getfilm
router.post('/:userId', async (req, res) => {
    const {year} = req.body

    const films = await Film.find({userId: req.params.userId})
    if (!films) return res.json({message: 'Film are not found'})

    res.json({
        data: films.filter(film => film.date.getFullYear() === year)
    })
})

//change film status
router.patch('/', async (req, res) => {
    const {filmId, filmStatus} = req.body

    //Create a new film
    const film = await Film.findById(filmId)
    film.isReady = filmStatus
    film.save()

    await film.save(async (err) => {
        if (err) return res.json({message: err})
    })

    res.json({
        message: 'Film successfully changed!',
        data: film
    })
})

//change film mark
router.patch('/mark', async (req, res) => {
    const {filmId, filmMark} = req.body

    //Create a new film
    const film = await Film.findOne({ _id: filmId})
    if(film.isReady === false) return res.json({message: 'Фильм не просмотрен'})
    film.mark = filmMark
    film.save()

   /* await film.save(async (err) => {
        if (err) return res.json({message: err})
    })*/

    res.json({
        message: 'Film successfully changed!',
        data: film
    })
})

module.exports = router
