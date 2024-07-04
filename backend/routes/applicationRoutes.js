const express = require('express');
const {
    createApplication,
    getApplication,
    editApplication,
    deleteApplication,
    getAllApplications,
    getAllApplicationsForApprover,
    approveApplication,
    rejectApplication, 
    getApplicationStatus,
    getApproverStatus //new
} = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', createApplication);
router.get('/:applicationId', authMiddleware, getApplication);
router.put('/:applicationId', authMiddleware, editApplication);
router.delete('/:applicationId', authMiddleware, deleteApplication);
router.get('/user/:userId',  getAllApplications);
router.get('/approver/:userId', getAllApplicationsForApprover);
router.post('/:applicationId/approve', authMiddleware, approveApplication);
router.post('/:applicationId/reject', authMiddleware, rejectApplication);
router.get('/:applicationId/status', authMiddleware, getApplicationStatus);
router.get('/:applicationId/approver/:approverId/status', getApproverStatus); // New 

module.exports = router;
