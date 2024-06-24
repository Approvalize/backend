const express = require('express');
const { registerUser, loginUser, getUserById, getUserIdByUsername } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:userId', authMiddleware, getUserById);
router.get('/username/:username/id', authMiddleware, getUserIdByUsername);

module.exports = router;
