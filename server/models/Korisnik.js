const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const korisnikSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter valid email"]
    },
    photo: String,
    role: {
        type: String,
        enum: ['korisnik', 'admin'],
        default: 'korisnik'
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(val) {
                return val == this.password
            },
            message: 'Password && Confirm Password doesnt match'
        }
    },
    passwordChangedAt: Date
})

korisnikSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next()
    }

    this.password = await bcryptjs.hash(this.password, 12)
    this.confirmPassword = undefined
    next()
})

korisnikSchema.methods.comparePasswordFromDB = async function(passwordFromUser, passwordFromDB) {
    return await bcryptjs.compare(passwordFromUser, passwordFromDB)
}

korisnikSchema.methods.isChangedPassword = async function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const passwordChangedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        console.log(passwordChangedTimeStamp, JWTTimestamp)
        
        return JWTTimestamp < passwordChangedTimeStamp 
    }
    return false;
}

module.exports = mongoose.model('Korisnik', korisnikSchema)