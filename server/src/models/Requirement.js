const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
    reqId: { type: String, unique: true }, // Auto-generated ID like REQ-001
    title: { type: String, required: true },
    
    // Company Reference (not required for backward compatibility)
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyProfile',
        required: false  // Changed to false for existing records
    },
    
    targetAudience: {
        type: String,
        enum: ['Distributor', 'Retailer', 'Both'],
        required: true
    },
    states: [{ type: String }], // Multi-select
    towns: [{ type: String }], // Multi-select

    marketingSupport: { type: Boolean, default: false },
    supportOptions: {
        marketingTeam: { type: Boolean, default: false },
        branding: { type: Boolean, default: false },
        influencerMeets: { type: Boolean, default: false },
        gifts: { type: Boolean, default: false },
        schemes: { type: Boolean, default: false },
        stockSupport: { type: Boolean, default: false },
    },
    notes: { type: String },

    status: {
        type: String,
        enum: ['OPEN', 'CLOSED', 'FULFILLED', 'EXPIRED'],
        default: 'OPEN'
    },
}, { timestamps: true });

// Pre-save hook to generate Auto ID
requirementSchema.pre('save', async function () {
    if (!this.isNew) return;

    try {
        const count = await mongoose.model('Requirement').countDocuments();
        this.reqId = `REQ-${(count + 1).toString().padStart(3, '0')}`;
    } catch (error) {
        throw error;
    }
});

module.exports = mongoose.model('Requirement', requirementSchema);
