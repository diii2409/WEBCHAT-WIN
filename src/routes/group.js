const express = require('express');
const router = express.Router();

const groupController = require('../controllers/GroupController');
const authController = require('../controllers/AuthController');

router.use(authController.authorize);

router.route('/').get(groupController.create).post(groupController.getAll);
router.route('/:id').get(groupController.get).patch(groupController.update).delete(groupController.delete);



module.exports = router;