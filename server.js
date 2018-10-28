// =======================================
//              DEPENDENCIES
// =======================================

const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const session = require('express-session');

// // =======================================
// //             SCHEMA & SEED
// // =======================================
// const Cars = require('./models/cars.js')
// const carSeeds = require ('./models/seed.js');
// =======================================
//              AUTH
// =======================================

app.use(session({
    secret: process.env.SECRET || process.env.HEROKU_SECRET,
    resave: false,
    saveUninitialized: false
}));



// app.use(session({
//     secret:'feedmeseymour',
//     resave: false,
//     saveUninitialized: false
// }));
// =======================================
//              PORT
// =======================================
// Allow use of Heroku's port or your own local port, depending on the environment
  const PORT = process.env.PORT || 3000;
// const PORT = process.env.PORT || process.env.DB_PORT;
// =======================================
//              GLOBAL CONFIG
// =======================================
const db = mongoose.connection;
// How to connect to the database either via heroku or locally
// const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_USER || 'mongodb://localhost/'+ 'movieCars';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/'+ 'movieCars';

// Connect to Mongo
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
db.once('open', ()=>{
  console.log('Connected to Mongo');
})

// =======================================
//             ERROR/SUCCESS MESSAGES
// =======================================
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// =======================================
//              MIDDLEWARE
// =======================================

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// =======================================
//              STATIC
// =======================================
app.use(express.static('public'));

// =======================================
//              CONTROLLERS
// =======================================
const carsController = require('./controllers/cars.js')
app.use('/cars', carsController)

const sessionsController = require('./controllers/sessions.js')
app.use('/sessions', sessionsController)

// =======================================
//            ROUTES
// =======================================

app.get('/', (req, res)=>{
  res.send('Hello world');
});

// =======================================
//         CREATE BOOKS FROM SEED
// =======================================
// Cars.create(carSeeds, (err, data) => {
//   if (err) console.log(err.message)
//   console.log('added cars');
// })

// =======================================
//            LISTENER
// =======================================
app.listen(PORT, () => {
  console.log('Cars Store app listening on port: '+PORT)
});
