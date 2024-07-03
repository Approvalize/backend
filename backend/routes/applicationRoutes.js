const express = require('express');
const {
    createApplication,
    getApplication,
    editApplication,
    deleteApplication,
    getAllApplications,
    approveApplication,
    rejectApplication, 
    getApplicationStatus
} = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', createApplication);
router.get('/:applicationId', authMiddleware, getApplication);
router.put('/:applicationId', authMiddleware, editApplication);
router.delete('/:applicationId', authMiddleware, deleteApplication);
router.get('/user/:userId', authMiddleware, getAllApplications);
router.post('/:applicationId/approve', authMiddleware, approveApplication);
router.post('/:applicationId/reject', authMiddleware, rejectApplication);
router.get('/:applicationId/status', authMiddleware, getApplicationStatus);

module.exports = router;
