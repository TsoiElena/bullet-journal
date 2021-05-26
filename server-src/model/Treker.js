const mongoose = require('mongoose')

const trekerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: new Date()
    },
    days: [
        {
            date: {
                type: Date,
                required: true,
            },
            isReady: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    ],
}, {collection: "treker"})

module.exports = mongoose.model('Treker', trekerSchema)
