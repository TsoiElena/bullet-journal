const express = require('express')
const Book = require('../model/Book')

const router = express.Router()

//add film
router.post('/add', async (req, res) => {
    const data = req.body

    //Create a new task
    const book = new Book(data)

    await book.save()

    res.json({
        message: 'Book successfully added!',
        data: book
    })
})

//getfilm
router.post('/:userId', async (req, res) => {
    const {year} = req.body

    const books = await Book.find({userId: req.params.userId})
    if (!books) return res.json({message: 'Book are not found'})

    res.json({
        data: books.filter(book => book.date.getFullYear() === year)
    })
})

//change film status
router.patch('/', async (req, res) => {
    const {bookId, bookStatus} = req.body

    //Create a new film
    const book = await Book.findById(bookId)
    book.isReady = bookStatus
    book.save()

    await book.save(async (err) => {
        if (err) return res.json({message: err})
    })

    res.json({
        message: 'Book successfully changed!',
        data: book
    })
})

//change film mark
router.patch('/mark', async (req, res) => {
    const {bookId, bookMark} = req.body

    //Create a new film
    const book = await Book.findOne({ _id: bookId})
    if(book.isReady === false) return res.json({message: 'Книга не прочитана'})
    book.mark = bookMark
    book.save()

   /* await film.save(async (err) => {
        if (err) return res.json({message: err})
    })*/

    res.json({
        message: 'Book successfully changed!',
        data: book
    })
})

module.exports = router
