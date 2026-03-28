const express = require('express');
const router = express.Router();
const {
    createRequest,
    getRequests,
    updateRequestStatus,
    deleteRequest
} = require('../controllers/requestController');

// Import our security middlewares and validators
const { protect, managerOnly } = require('../middleware/authMiddleware');
const { validateWasteRequest, handleValidationErrors } = require('../middleware/validators');

// Route to get requests and create a new request
// Notice how BOTH require the user to be logged in (protect)
router.route('/')
    .get(protect, getRequests)
    .post(protect, ...validateWasteRequest, handleValidationErrors, createRequest);

// Route to update and delete specific requests by ID
// Notice how these require BOTH protect AND managerOnly
router.route('/:id')
    .put(protect, managerOnly, updateRequestStatus)
    .delete(protect, managerOnly, deleteRequest);

module.exports = router;