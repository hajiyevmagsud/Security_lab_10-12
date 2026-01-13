const isAlphanumericWithUnderscore = (value) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(value)) {
        throw new Error('Value can only contain letters, numbers, and underscores');
    }
    return true;
};

const isSafeString = (value) => {
    const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(value)) {
            throw new Error('Value contains potentially dangerous content');
        }
    }

    return true;
};

const isValidObjectId = (value) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(value)) {
        throw new Error('Invalid ID format');
    }
    return true;
};

module.exports = {
    isAlphanumericWithUnderscore,
    isSafeString,
    isValidObjectId,
};
