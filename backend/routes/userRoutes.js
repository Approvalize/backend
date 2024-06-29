const express = require('express');
const { registerUser, loginUser, getUserIdByUsername, getUserById, registerUsersFromCSV } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/register-users', authMiddleware, upload.single('file'), registerUsersFromCSV);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:userId', authMiddleware, getUserById);
router.get('/username/:username/id', authMiddleware, getUserIdByUsername);

module.exports = router;
