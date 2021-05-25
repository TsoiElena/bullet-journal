const mongoose =  require('mongoose')

const eventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: Number, /*0-birthdays, 1-iportant dtes, 2-notes, 3 - notes month*/
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
}, { collection: "event" })

module.exports = mongoose.model('Event', eventSchema)
