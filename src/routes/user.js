const express = require('express');
const router = express.Router();

const userController = require('../controller/UserController');

router.post('/store/courses', meController.storeCourses);

module.exports = router;