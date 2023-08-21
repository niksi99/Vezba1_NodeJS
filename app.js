require('dotenv').config();
const express = require('express');
const MongoDB = require('./server/config/DB');
const EmployeeRoute = require('./server/routes/EmployeeRoute');
const AuthRoute = require('./server/routes/AuthRoute');


const app = express()

MongoDB();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(EmployeeRoute);
app.use(AuthRoute);

app.listen(4380, () => {
    console.log('Radi na 4380')
});