const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/EmployeeController');
const { protectRoutes, roles } = require('../middleware/Middleware');

router.get('/allEmployees', protectRoutes, roles('admin'), EmployeeController.getAllEmployees);
router.get('/high5', EmployeeController.getHighestPayed, EmployeeController.getAllEmployees);
router.get('/stats', EmployeeController.getEmployeeStats);
router.get('/getByOcup', EmployeeController.getEmployeeByOccupation)

router.post('/addNew', EmployeeController.addNew)

router.delete('/:id', 
     EmployeeController.deleteAnEmployee)
module.exports = router;