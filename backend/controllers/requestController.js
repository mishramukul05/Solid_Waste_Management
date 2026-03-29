const WasteRequest = require('../models/WasteRequest');

// @desc    Create a new waste request
// @route   POST /api/v1/requests
// @access  Private (Citizen or Manager)
const createRequest = async (req, res) => {
    try {
        const { title, description, wasteCategory, location } = req.body;

        const newRequest = await WasteRequest.create({
            title,
            description,
            wasteCategory,
            location,
            citizenId: req.user._id // We get this from the protect middleware!
        });

        res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get waste requests (Citizens see their own, Managers see all)
// @route   GET /api/v1/requests
// @access  Private
const getRequests = async (req, res) => {
    try {
        let requests;

        if (req.user.role === 'manager') {
            // Managers see everything, and we 'populate' the citizen data to see who made it
            requests = await WasteRequest.find().populate('citizenId', 'name email');
        } else {
            // Citizens only see their own requests
            requests = await WasteRequest.find({ citizenId: req.user._id });
        }

        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Update request status
// @route   PUT /api/v1/requests/:id
// @access  Private (Manager Only)
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Ensure the status is valid
        if (!['Pending', 'Dispatched', 'Resolved'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const request = await WasteRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: 'after', runValidators: true }
        );

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a waste request
// @route   DELETE /api/v1/requests/:id
// @access  Private (Citizen or Manager)
const deleteRequest = async (req, res) => {
    try {
        const request = await WasteRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Make sure user owns the request or is a manager
        if (request.citizenId.toString() !== req.user.id && req.user.role !== 'manager') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this request' });
        }

        await request.deleteOne();

        res.status(200).json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createRequest,
    getRequests,
    updateRequestStatus,
    deleteRequest
};