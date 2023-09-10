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
const Item = require('./models/item')
const twilio = require('twilio');

const accountSid = 'AC013e7bb3fa7ffe9f66485ecc5e3d18e4';
const authToken = '9ecfecef48b55908080840a77227baaa';



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


const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const item = new Item({
    name: 'Rosatis',
    location: 'Flowermound'
})

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
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.redirect('/register');
    }
});
app.get('/dashboard/restaurant', (req, res) => { 
    res.render('dashRestaurant.ejs')
})

app.get('/dashboard/customer', (req, res) => { 
    res.render('dashCustomer.ejs')
})

app.get('/order', (req, res) => { 
    res.render('order.ejs')
})

app.get('/checkout', (req, res) => {
    const client = new twilio(accountSid, authToken);

    client.messages
    .create({ from: '+13607975949', body: 'Hi there', to: '+14172270259' })
    .then(message => {
        console.log(`SMS sent with SID: ${message.sid}`);
        res.send("SMS sent successfully");
    })
    .catch(error => {
        console.error(`Error sending SMS: ${error.message}`);
        res.status(500).send("Error sending SMS");
    });
});
/*
const start = async() => {
    try{
        await mongoose.connect('mongodb+srv://bartheart :Rew7wAJo2QNiYVp6@cluster0.yygujyk.mongodb.net/?retryWrites=true&w=majority')
        
    } catch (e) {
        console.log(e.message)
    }
}

start()*/

app.listen(3000)