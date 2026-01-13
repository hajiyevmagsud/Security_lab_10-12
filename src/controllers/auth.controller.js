const authService = require('../services/auth.service');
const { getCookieOptions } = require('../config/jwt');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../middleware/error.middleware');

class AuthController {
    register = asyncHandler(async (req, res) => {
        const { email, username, password } = req.body;

        const result = await authService.register({ email, username, password });

        res.cookie('jwt', result.token, getCookieOptions());

        res.status(201).json(
            ApiResponse.success(201, result.user, 'User registered successfully')
        );
    });

    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.cookie('jwt', result.token, getCookieOptions());

        res.status(200).json(
            ApiResponse.success(200, result.user, 'Login successful')
        );
    });

    logout = asyncHandler(async (req, res) => {
        res.clearCookie('jwt');

        res.status(200).json(
            ApiResponse.success(200, null, 'Logout successful')
        );
    });

    getCurrentUser = asyncHandler(async (req, res) => {
        const user = await authService.getUserById(req.user._id);

        res.status(200).json(
            ApiResponse.success(200, user, 'User retrieved successfully')
        );
    });

    refreshToken = asyncHandler(async (req, res) => {
        const user = await authService.getUserById(req.user._id);

        const { generateToken } = require('../config/jwt');
        const token = generateToken({ userId: user.id, role: req.user.role });

        res.cookie('jwt', token, getCookieOptions());

        res.status(200).json(
            ApiResponse.success(200, user, 'Token refreshed successfully')
        );
    });
}

module.exports = new AuthController();
