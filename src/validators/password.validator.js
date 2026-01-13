const commonPasswords = [
    'password', 'password123', '12345678', 'qwerty', 'abc123',
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
    'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
    'bailey', 'passw0rd', 'shadow', '123123', '654321',
    'superman', 'qazwsx', 'michael', 'football', 'password1',
];

const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)');
    }

    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Password is too common. Please choose a more secure password');
    }

    if (errors.length > 0) {
        throw new Error(errors.join('. '));
    }

    return true;
};

const analyzePasswordStrength = (password) => {
    let strength = 0;
    const feedback = [];

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    if (strength < 3) {
        feedback.push('Weak password');
    } else if (strength < 5) {
        feedback.push('Moderate password');
    } else {
        feedback.push('Strong password');
    }

    return {
        strength,
        feedback: feedback.join(', '),
    };
};

module.exports = {
    validatePassword,
    analyzePasswordStrength,
    commonPasswords,
};
