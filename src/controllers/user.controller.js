const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../middleware/error.middleware');

class UserController {
    getProfile = asyncHandler(async (req, res) => {
        const user = await userService.getUserById(req.user._id);

        res.status(200).json(
            ApiResponse.success(200, user, 'Profile retrieved successfully')
        );
    });

    updateProfile = asyncHandler(async (req, res) => {
        const user = await userService.updateUser(req.user._id, req.body);

        res.status(200).json(
            ApiResponse.success(200, user, 'Profile updated successfully')
        );
    });

    deleteAccount = asyncHandler(async (req, res) => {
        await userService.deleteUser(req.user._id);

        res.clearCookie('jwt');

        res.status(204).send();
    });

    getAllUsers = asyncHandler(async (req, res) => {
        const { page, limit, role, isActive } = req.query;

        const filters = {};
        if (role) filters.role = role;
        if (isActive !== undefined) filters.isActive = isActive === 'true';

        const result = await userService.getAllUsers(filters, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        });

        res.status(200).json(
            ApiResponse.paginated(
                200,
                result.users,
                result.pagination,
                'Users retrieved successfully'
            )
        );
    });

    getUserById = asyncHandler(async (req, res) => {
        const user = await userService.getUserById(req.params.id);

        res.status(200).json(
            ApiResponse.success(200, user, 'User retrieved successfully')
        );
    });
}

module.exports = new UserController();
