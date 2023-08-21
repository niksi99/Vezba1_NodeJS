const Korisnik = require('../models/Korisnik');
const jwt = require('jsonwebtoken');
const util = require('util')

exports.protectRoutes = async(req, res, next) => {
    const token_test = req.headers.authorization
    let token;
    console.log(token_test)
    if(token_test && token_test.startsWith('Bearer')) {
        token = token_test.split(' ')[1];
    }
    console.log("\n"+token)
    if(!token) {
        res.status(401).json({
            status: '401 Unauthorized - Token fucked up'
        })
    }
    
    const decodedToken = await jwt.verify(token, process.env.SECRET)
    //console.log(decodedToken)
    const dajKorisnika = await Korisnik.findById(decodedToken.id)
    if(!dajKorisnika) {
        res.status(401).json({
            status: '401 Unauthorized - User with the given token dosnt exist'
        })
    }

    if(await dajKorisnika.isChangedPassword(decodedToken.iat)) {
        res.status(401).json({
            message: 'Password was recently changed. Please login again!'
        })
    }

    req.user = await Korisnik.findById(decodedToken.id)
    console.log(req.user)
    next();
}

module.exports.roles = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role) {
            res.status(403).json({
                message: '403 FORBIDEN - Not permission for this actiont'
            })
            next();
        }
        next();
    }
}