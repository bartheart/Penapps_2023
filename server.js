if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const path = require('path');

const intitalize_passport = require('./passport')
intitalize_passport(passport, email => {
    users.find(user => user.email === email)
})
 
const users = []

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

/*
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/test')
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', error => console.log("Connected to mongoose"))*/

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/login', (req, res) => { 
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))


app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})

app.get('/dashboard/restaurant', (req, res) => { 
    res.render('dashRestaurant.ejs')
})

app.get('/dashboard/customer', (req, res) => { 
    res.render('dashCustomer.ejs')
})

app.listen(3000)