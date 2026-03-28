const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    wasteCategory: {
        type: String,
        enum: ['Municipal Solid Waste', 'Hazardous', 'Recyclable', 'Biomedical', 'E-Waste'],
        required: true
    },
    location: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: ['Pending', 'Dispatched', 'Resolved'],
        default: 'Pending'
    },
    citizenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This creates a relationship between the Request and the User
        required: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('WasteRequest', requestSchema);