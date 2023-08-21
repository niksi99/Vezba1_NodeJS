const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    jmbg: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    payement: {
        type: Number,
        required: true
    },
    hobbies: {
        type: [String],
        required: true
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

employeeSchema.virtual('payementInDinars').get(function(){
    return this.payement * 118;
})

module.exports = mongoose.model('Employee', employeeSchema)