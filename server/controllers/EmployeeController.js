const Employee = require('../models/Employee')

module.exports.getAllEmployees = async(req, res) => {
    try {
        const page = req.query.page*1 || 1;
        const limit = req.query.limit*1 || 5;
        const perPage = (page - 1) * limit
        const allEmployees = await Employee
            .find()
            .sort({payement: 'asc', firstName: 'asc', lastName: 'asc'})
            .skip(perPage)
            .limit(limit)
            .exec();

        if(req.query.page) {
            const emplCount = await Employee.find().count
            if(perPage >= emplCount) {
                throw new Error('Page not found.');
            }
        }
        res.status(200).json({
            length: allEmployees.length,
            allEmployees
        })
    }
    catch(error) {
        res.status(404).json({
            message: error.message
        })
    }
}

exports.getHighestPayed = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-payement';

    next()
}

module.exports.getEmployeeStats = async (req, res) => {
    try {
        const stats = await Employee.aggregate([
            { $match: {payement: {$gte: 300}} },
            { $group: {
                _id: '$firstName',
                averagePayement: { $avg: '$payement'},
                minPayement: { $min: '$payement'},
                maxPayement: { $max: '$payement'},
                totalMoneyForPayements: { $sum: '$payement'},
                numberOfEmployees: { $sum: 1}
            }},
            { $sort: {minPayement: 1}},
            { $match: {maxPayement: {$gte: 4000}}}
        ])

        res.status(200).json(stats)
    }
    catch(error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}

module.exports.getEmployeeByOccupation = async(req, res) => {
    try {
        //const occupation = req.params.occupation
        const employees = await Employee.aggregate([
            {$unwind: '$hobbies'},
            {$group: {
                _id: '$hobbies',
                employeeName: {$push: '$firstName'},
            }},
            {$addFields: {hobbies: "$_id"}},
            {$project: {_id: 0}}
        ])

        //console.log(occupation)
        res.status(200).json(employees)
    }
    catch(error) {
        res.status(404).json({
            message: error.message
        })
    }
}

module.exports.addNew = async (req, res) => {
    try {
        const newEmployee = Employee.create(req.body);
        res.status(201).json(newEmployee)
    }
    catch(error) {
        console.log(object)
    }
}

module.exports.deleteAnEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: 'success',
            data: employee
        });
    }
    catch(error) {
        console.log(error)
        res.status(400).json({
            status: 'fail',
            data: null
        });
    }
}