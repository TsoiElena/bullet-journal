const mongoose = require('mongoose')

const moneySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    saved: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    limit: {
        type: Number,
        required: true,
    },
    toSave: {
        type: Number,
        required: true,
    },
    income: {
        type: Number,
        required: true,
        default: 0
    },
    spent: {
        type: Number,
        required: true,
        default: 0
    },
    savedInMonth: {
        type: Number,
        required: true,
        default: 0
    },

    planPay: [
        {
            date: {
                type: Date,
                required: true,
            },
            moneySpent: {
                type: Number,
                required: true,
            },
            isReady: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    ],
    unplanPay: [
        {
            date: {
                type: Date,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            moneySpent: {
                type: Number,
                required: true,
            },
        }
    ],
    days: [
        {
            date: {
                type: Date,
                required: true,
            },
            plus: {
                type: Number,
                required: true,
            },
            minus: {
                type: Number,
                required: true,
            },
            saved: {
                type: Number,
                required: true,
            },
        }
    ],
}, {collection: "money"})

module.exports = mongoose.model('Money', moneySchema)
