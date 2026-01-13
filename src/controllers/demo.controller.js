const multer = require('multer');
const path = require('path');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middleware/error.middleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(ApiError.unsupportedMediaType('Only images, PDFs, and text files are allowed'));
        }
    },
});

class DemoController {
    readHeaders = asyncHandler(async (req, res) => {
        const headers = {
            'user-agent': req.get('user-agent'),
            'content-type': req.get('content-type'),
            'accept': req.get('accept'),
            'host': req.get('host'),
            'custom-header': req.get('x-custom-header'),
            'all-headers': req.headers,
        };

        res.status(200).json(
            ApiResponse.success(200, headers, 'Headers retrieved successfully')
        );
    });

    parseJson = asyncHandler(async (req, res) => {
        const { name, age, email } = req.body;

        if (!name || typeof name !== 'string') {
            throw ApiError.badRequest('Name is required and must be a string');
        }

        if (!age || typeof age !== 'number') {
            throw ApiError.badRequest('Age is required and must be a number');
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw ApiError.badRequest('Valid email is required');
        }

        res.status(200).json(
            ApiResponse.success(200, { name, age, email }, 'JSON parsed successfully')
        );
    });

    parseForm = asyncHandler(async (req, res) => {
        const formData = req.body;

        res.status(200).json(
            ApiResponse.success(200, formData, 'Form data parsed successfully')
        );
    });

    handleUpload = [
        upload.single('file'),
        asyncHandler(async (req, res) => {
            if (!req.file) {
                throw ApiError.badRequest('No file uploaded');
            }

            const fileInfo = {
                originalName: req.file.originalname,
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
            };

            res.status(200).json(
                ApiResponse.success(200, fileInfo, 'File uploaded successfully')
            );
        }),
    ];

    returnStatus = asyncHandler(async (req, res) => {
        const code = parseInt(req.params.code);

        const statusMessages = {
            200: 'OK',
            201: 'Created',
            204: 'No Content',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            415: 'Unsupported Media Type',
            500: 'Internal Server Error',
        };

        const message = statusMessages[code] || 'Unknown Status';

        if (code >= 400) {
            throw new ApiError(code, message);
        }

        if (code === 204) {
            return res.status(204).send();
        }

        res.status(code).json(
            ApiResponse.success(code, null, message)
        );
    });

    triggerError = asyncHandler(async (req, res) => {
        const { type } = req.query;

        switch (type) {
            case 'validation':
                throw ApiError.badRequest('Validation error example');
            case 'unauthorized':
                throw ApiError.unauthorized('Unauthorized error example');
            case 'forbidden':
                throw ApiError.forbidden('Forbidden error example');
            case 'notfound':
                throw ApiError.notFound('Not found error example');
            case 'server':
                throw ApiError.internal('Internal server error example');
            default:
                throw new Error('Generic error example');
        }
    });

    testContentType = asyncHandler(async (req, res) => {
        const { format } = req.query;

        const data = {
            message: 'Content type demonstration',
            timestamp: new Date().toISOString(),
        };

        switch (format) {
            case 'xml':
                res.set('Content-Type', 'application/xml');
                res.status(200).send(`
          <?xml version="1.0"?>
          <response>
            <message>${data.message}</message>
            <timestamp>${data.timestamp}</timestamp>
          </response>
        `);
                break;
            case 'text':
                res.set('Content-Type', 'text/plain');
                res.status(200).send(`Message: ${data.message}\nTimestamp: ${data.timestamp}`);
                break;
            case 'html':
                res.set('Content-Type', 'text/html');
                res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <body>
              <h1>${data.message}</h1>
              <p>Timestamp: ${data.timestamp}</p>
            </body>
          </html>
        `);
                break;
            default:
                res.status(200).json(ApiResponse.success(200, data, 'JSON response'));
        }
    });
}

module.exports = new DemoController();
