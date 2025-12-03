const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('🔐 JWT Token received (first 20 chars):', token.substring(0, 20) + '...');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('🔓 JWT Decoded - User ID:', decoded.id);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.error('❌ Not authorized, user not found in DB for ID:', decoded.id);
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            console.log('✅ User authenticated:', req.user.email, '| Role:', req.user.role);

            next();
        } catch (error) {
            console.error('❌ Auth Middleware Error:', error.message);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        console.error('❌ No token provided in request');
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const extractUser = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            console.error('Extract User Error:', error.message);
            // Do not throw error, just continue with req.user as undefined
        }
    }
    next();
});

// Role-based access control middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, no user found');
        }

        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`User role ${req.user.role} is not authorized to access this resource`);
        }

        next();
    };
};

module.exports = { protect, extractUser, authorize };
