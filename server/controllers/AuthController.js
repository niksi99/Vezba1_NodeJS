const Korisnik = require('../models/Korisnik');
const jwt = require('jsonwebtoken');

const signToken = (id, email) => {
    return jwt.sign(
        { id, email},
        process.env.SECRET, 
        { expiresIn: process.env.LOGIN_EXPIRES }
    )
}

module.exports.signup = async (req, res, next) => {
    const noviKorisnik = await Korisnik.create(req.body);  
    
    const token = signToken(noviKorisnik._id, noviKorisnik.email)
    
    try {
        res.status(201).json({
            status: 'success',
            token,
            korisnik: noviKorisnik
        })
    }
    catch(error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

module.exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        res.status(400).json({
            status: "error",
            message: 'Nepostojeci email i password u req.body'
        })
    }

    const user = await Korisnik
        .findOne({ email })
        .select('+password')

    if(!user || !(await user.comparePasswordFromDB(password, user.password))) {
        res.status(400).json({
            status: "error",
            message: 'Inccoredct email of passwrod'
        })
    }

    const token = signToken(user._id, user.email)

    try {
        res.status(200).json({
            status: "success - logged in",
            token,
            user
        })
    }
    catch(error) {
        res.status(404).json({
            status: "error",
            message: 'Wrong email'
        })
    }

}