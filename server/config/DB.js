const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/EmployeeDB'

const MongoDB = async() => {
    await mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((rez) => console.log('Radi Mongo'))
      .catch((error) => console.log(error))
}

module.exports = MongoDB;