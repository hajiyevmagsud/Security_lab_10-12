const ApiError = require('../utils/ApiError');

const requireRole = (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError.unauthorized('Authentication required'));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                ApiError.forbidden(
                    `Access denied. Required role: ${allowedRoles.join(' or ')}`
                )
            );
        }

        next();
    };
};

const requireAdmin = requireRole('ADMIN');

const requireOwnership = (paramName = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError.unauthorized('Authentication required'));
        }

        const resourceUserId = req.params[paramName] || req.body[paramName];

        if (!resourceUserId) {
            return next(ApiError.badRequest(`Missing ${paramName} parameter`));
        }

        if (
            req.user._id.toString() !== resourceUserId.toString() &&
            req.user.role !== 'ADMIN'
        ) {
            return next(
                ApiError.forbidden('You can only access your own resources')
            );
        }

        next();
    };
};

module.exports = {
    requireRole,
    requireAdmin,
    requireOwnership,
};
