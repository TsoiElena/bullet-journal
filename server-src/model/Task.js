const mongoose =  require('mongoose')

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: Number, /*0-global tasks, 1-day tasks, 2-buy to day, 3-month tasks*/
        required: true,
        default: 1
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
    isReady: {
        type: Boolean,
        required: true,
        default: false
    }

}, { collection: "task" })

module.exports = mongoose.model('Task', taskSchema)
