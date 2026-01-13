class ApiResponse {
    static success(statusCode = 200, data = null, message = 'Success') {
        return {
            success: true,
            statusCode,
            message,
            data,
        };
    }

    static error(statusCode = 500, message = 'Error', errors = null) {
        const response = {
            success: false,
            statusCode,
            message,
        };

        if (errors) {
            response.errors = errors;
        }

        return response;
    }

    static paginated(statusCode = 200, data = [], pagination = {}, message = 'Success') {
        return {
            success: true,
            statusCode,
            message,
            data,
            pagination: {
                page: pagination.page || 1,
                limit: pagination.limit || 10,
                total: pagination.total || 0,
                totalPages: pagination.totalPages || 0,
            },
        };
    }
}

module.exports = ApiResponse;
