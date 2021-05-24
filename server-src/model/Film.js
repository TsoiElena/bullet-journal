const mongoose =  require('mongoose')

const filmSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: Number, /*0-film, 1-mult, 2-*/
        required: true,
        default: 1
    },
    title: {
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

}, { collection: "film" })

module.exports = mongoose.model('Film', filmSchema)
