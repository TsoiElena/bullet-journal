const express = require('express')
const Money = require('../model/Money')

const router = express.Router()
const datesCompare = (date, reqDate) => {
    const moneyDate = new Date(date)
    const reqMoneyDate = new Date(reqDate)
    return moneyDate.getFullYear() === reqMoneyDate.getFullYear()
        && moneyDate.getMonth() === reqMoneyDate.getMonth()
        && moneyDate.getDate() === reqMoneyDate.getDate()
}

const compareMonthDate = (date, reqDate) => {
    const moneyDate = new Date(date)
    const reqMoneyDate = new Date(reqDate)
    return moneyDate.getFullYear() === reqMoneyDate.getFullYear()
        && moneyDate.getMonth() === reqMoneyDate.getMonth()
}

//add money plan for month
router.post('/add', async (req, res) => {
    const data = req.body
    const {date, userId} = req.body

    const moneys = await Money.find({userId: userId})
    if (moneys.filter(money => compareMonthDate(money.date, date)).length) return res.json({message: 'План на данный месяц уже создан'})
    //Create a new money
    const money = new Money(data)

    await money.save()

    res.json({
        message: 'Plan successfully added!',
        data: money
    })
})

//get money plan
router.post('/:userId', async (req, res) => {
    const {date} = req.body

    const moneys = await Money.find({userId: req.params.userId})
    if (!moneys) return res.json({message: 'Plan are not found'})

    res.json({
        data: moneys.filter(money => compareMonthDate(money.date, date))[0]
    })
})

//add plan pay
router.post('/plan-pay/add', async (req, res) => {
    const {moneyId} = req.body

    //Create a new plan pay
    const money = await Money.findById(moneyId)
    const newPlanPay = {
        date: new Date(req.body.date),
        title: req.body.title,
        moneySpent: req.body.moneySpent
    }
    let limit = money.limit
    money.planPay.push(newPlanPay)
    limit += newPlanPay.moneySpent
    money.limit = limit

    await money.save()

    return res.json({
        message: 'Plan successfully changed!',
        data: money
    })
})

//change plan pay status
router.patch('/plan-pay/change', async (req, res) => {
    const {moneyId, planPayId} = req.body

    //Create a new plan pay
    const money = await Money.findById(moneyId)
    let spent = money.spent
    let balance = money.balance
    money.planPay.map(plan => {
        if (plan._id.toString() === planPayId) {
            const newPlan = plan
            newPlan.isReady = true
            balance -= newPlan.moneySpent
            if (balance < 0) return res.json({message: 'Недостаточно средств'})
            spent += newPlan.moneySpent
            return newPlan
        }
        return plan
    })
    money.balance = balance
    money.spent = spent

    await money.save(async (err) => {
        if (err) return res.json({message: err})
    })

    res.json({
        message: 'Plan successfully changed!',
        data: money
    })
})

//add unplan pay
router.post('/unplan-pay/add', async (req, res) => {
    const {moneyId} = req.body

    //Create a new unplan pay
    const money = await Money.findById(moneyId)
    const newUnplanPay = {
        date: new Date(req.body.date),
        title: req.body.title,
        moneySpent: req.body.moneySpent
    }
    let spent = money.spent
    let balance = money.balance
    balance -= newUnplanPay.moneySpent
    if (balance < 0) return res.json({message: 'Недостаточно средств'})
    spent += newUnplanPay.moneySpent
    money.unplanPay.push(newUnplanPay)
    money.balance = balance
    money.spent = spent

    await money.save(async (err) => {
        if (err) return res.json({message: err})
    })

    res.json({
        message: 'Plan successfully changed!',
        data: money
    })
})

//add day
router.post('/day/add', async (req, res) => {
    const {moneyId} = req.body

    //Create a new day
    const money = await Money.findById(moneyId)

    let balance = money.balance
    let saved = money.saved
    let income = money.income
    let spent = money.spent
    let savedInMonth = money.savedInMonth

    if (money.days.filter(day => datesCompare(day.date, req.body.date)).length) {
        let newDay = {}
        let i = 0
        money.days.map((day, index) => {
            if (datesCompare(day.date, req.body.date)) {
                i = index
                newDay = {
                    date: req.body.date,
                    plus: day.plus + req.body.plus,
                    minus: day.minus + req.body.minus,
                    saved: day.saved + req.body.saved
                }
                balance += req.body.plus
                req.body.saved > 0 ? balance -= req.body.saved : balance -= req.body.saved
                if (balance < 0) return res.json({message: 'Недостаточно средств чтобы пополнить отложения'})
                balance -= req.body.minus
                if (balance < 0) return res.json({message: 'Недостаточно средств на покупки'})

                req.body.saved > 0 ? saved += req.body.saved : saved += req.body.saved
                if (saved < 0) return res.json({message: 'Недостаточно средств для пополнения баланса с отложенных'})

                income += req.body.plus

                spent += req.body.minus

                savedInMonth += req.body.saved
                return newDay
            }
            return day
        })
        money.balance = balance
        money.saved = saved
        money.income = income
        money.spent = spent
        money.savedInMonth = savedInMonth

        money.days[i] = newDay

        await money.save(async (err) => {
            if (err) return res.json({message: err})
        })

        return res.json({
            message: 'Plan successfully changed!',
            data: money
        })

    } else {
        const newDay = {
            date: new Date(req.body.date),
            plus: req.body.plus,
            minus: req.body.minus,
            saved: req.body.saved
        }

        balance += newDay.plus
        newDay.saved > 0 ? balance -= newDay.saved : balance += newDay.saved
        if (balance < 0) return res.json({message: 'Недостаточно средств чтобы пополнить отложения'})
        balance -= newDay.minus
        if (balance < 0) return res.json({message: 'Недостаточно средств на покупки'})

        newDay.saved > 0 ? saved += newDay.saved : saved -= newDay.saved
        if (saved < 0) return res.json({message: 'Недостаточно средств для пополнения баланса с отложенных'})

        income += newDay.plus

        spent += newDay.minus

        savedInMonth += newDay.saved

        // money.days.push(newDay)
        money.balance = balance
        money.saved = saved
        money.income = income
        money.spent = spent
        money.savedInMonth = savedInMonth

        await money.save(async (err) => {
            if (err) return res.json({message: err})
        })

        await Money.findByIdAndUpdate(moneyId, {
            $push: {
                days: newDay
            }
        })
        const newMoney = await Money.findById(moneyId)
        return res.json({
            message: 'Plan successfully changed!',
            data: newMoney
        })


    }
})


module.exports = router