const authService = require('../services/auth.service');
const { getCookieOptions } = require('../config/jwt');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../middleware/error.middleware');

class AuthController {
    register = asyncHandler(async (req, res) => {
        const { email, username, password } = req.body;

        const result = await authService.register({ email, username, password });

        res.cookie('jwt', result.accessToken, getCookieOptions('access'));
        res.cookie('refreshToken', result.refreshToken, getCookieOptions('refresh'));

        res.status(201).json(
            ApiResponse.success(201, result.user, 'User registered successfully')
        );
    });

    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.cookie('jwt', result.accessToken, getCookieOptions('access'));
        res.cookie('refreshToken', result.refreshToken, getCookieOptions('refresh'));

        res.status(200).json(
            ApiResponse.success(200, result.user, 'Login successful')
        );
    });

    logout = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        await authService.logout(refreshToken);

        res.clearCookie('jwt', getCookieOptions('access'));
        res.clearCookie('refreshToken', getCookieOptions('refresh'));

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
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json(ApiResponse.error(401, 'Refresh token required'));
        }

        const result = await authService.refreshAccessToken(refreshToken);

        res.cookie('jwt', result.accessToken, getCookieOptions('access'));
        res.cookie('refreshToken', result.refreshToken, getCookieOptions('refresh'));

        res.status(200).json(
            ApiResponse.success(200, result.user, 'Token refreshed successfully')
        );
    });
}

module.exports = new AuthController();

