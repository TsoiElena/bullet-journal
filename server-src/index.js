const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const PORT = 4000
const DB_CONNECT = 'mongodb+srv://artdevil:7411@cluster0.tw2zm.mongodb.net/bujo?retryWrites=true&w=majority'

//Connect to DB
mongoose.connect(
    DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true },
    () => console.log('Connected to db!')
)

//Import Routes
const authRoute = require('./routes/auth')
const taskRoute = require('./routes/task')
const eventRoute = require('./routes/event')
const filmRoute = require('./routes/film')
const bookRoute = require('./routes/book')
const trekerRoute = require('./routes/treker')
const moneyRoute = require('./routes/money')

//Middleware
app.use(express.json())
app.use(cors({ origin: true, credentials: true }))

//Route Middlewares
app.use('/auth', authRoute)
app.use('/tasks', taskRoute)
app.use('/events', eventRoute)
app.use('/films', filmRoute)
app.use('/books', bookRoute)
app.use('/trekers', trekerRoute)
app.use('/moneys', moneyRoute)



app.listen(PORT, () => console.log('Server Up and running on port', PORT))
