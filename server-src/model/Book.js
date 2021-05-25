const mongoose =  require('mongoose')

const bookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    authtor: {
        type: String,
        required: true,
    },
    isReady: {
        type: Boolean,
        required: true,
        default: false
    },
    mark: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        required: true,
        default: new Date()
    }

}, { collection: "book" })

module.exports = mongoose.model('Book', bookSchema)
