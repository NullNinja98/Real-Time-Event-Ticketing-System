const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const cors = require('cors');

//import routes 
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const paymentRoutes = require('./routes/payments')

//app middlewear
app.use(bodyParser.json());

app.use(cors());

app.use(eventRoutes);
app.use(userRoutes);
app.use(ticketRoutes);
app.use(paymentRoutes);

const PORT = 8000;
const DB_URL = 'mongodb+srv://nullninja98:oFNmY1P8pRR4ZWaJ@ticketingsystemcluster.zf5no.mongodb.net/'

mongoose.connect(DB_URL,{
})

.then(()=>{
    console.log('DB connected');
}).catch((err)=>
console.log('DB connection error', err));

app.listen(PORT, ()=>{
    console.log(`App is  running on ${PORT}`);
})