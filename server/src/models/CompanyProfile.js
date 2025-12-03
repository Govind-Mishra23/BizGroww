const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    country: { type: String, default: 'India' },
    state: { type: String, required: true },
    town: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
});

const companyProfileSchema = new mongoose.Schema({
    // 1. Company Information
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    companyName: { type: String, default: '' },
    industry: { type: String, default: '' },
    businessModel: [{
        type: String,
        enum: ['Manufacturer', 'Outsourcing', 'Importer', 'Distributor', 'Supplier', 'Dealer', 'C&F', 'OEM', 'Showroom']
    }],
    companyType: {
        type: String,
        enum: ['Proprietor', 'Partnership', 'LLP', 'Pvt Ltd', 'Public Ltd'],
        default: 'Proprietor'
    },
    incorporationYear: { type: String, default: '' },
    gstNumber: {
        type: String,
        default: '',
        validate: {
            validator: function(v) {
                // Only validate if value is provided
                if (!v || v === '') return true;
                return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
            },
            message: 'Please enter a valid GST Number'
        }
    },
    ownerName: { type: String, default: '' },
    otherDirectors: [{ type: String }], // Added for Distributor

    contactNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },

    // 2. Address Information
    headOffice: {
        country: { type: String, default: 'India' },
        state: { type: String, default: '' },
        town: { type: String, default: '' },
        address: { type: String, default: '' },
    },
    manufacturingUnit: {
        country: { type: String, default: 'India' },
        state: { type: String },
        town: { type: String },
        address: { type: String },
    },

    // 3. Branches
    branches: [branchSchema],

    // Tab 3: Product Portfolio
    products: [{
        category: { type: String, required: true },
        subCategory: { type: String },
        quantityBand: { type: String },
        brandName: { type: String },
        multiBrandSupport: { type: Boolean, default: false },
        otherProduct: { type: String }, // Free-text
    }],

    // Distributor Specific Tabs
    // Tab 3: Business Network Area (Distributor)
    geographicCoverage: {
        country: { type: String, default: 'India' },
        states: [{
            state: { type: String },
            districts: [{ type: String }]
        }]
    },

    // Tab 4: Network Details (Distributor)
    networkDetails: {
        distributorNetwork: { 
            type: String, 
            enum: ['0–50', '50–100', '100–200', '200–300', '300 & Above'] 
        },
        influencerNetwork: { 
            type: String, 
            enum: ['0–50', '50–100', '100–200', '200–300', '300 & Above'] 
        }
    },

    // Tab 4: Gallery (Image URLs)
    gallery: {
        factory: [{ type: String }],
        machinery: [{ type: String }],
        offices: [{ type: String }],
        warehouse: [{ type: String }],
        products: [{ type: String }],
        events: [{ type: String }],
    },

    // Tab 5: Certificates (Document URLs)
    certificates: {
        gst: { type: String },
        iso: { type: String },
        msme: { type: String },
        importLicense: { type: String },
        compliance: [{ type: String }], // Array for multiple compliance docs
    },

    // Admin Status
    status: {
        type: String,
        enum: ['pending', 'underReview', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
