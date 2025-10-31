const bcrypt = require('bcrypt');
const { supabase } = require('../config/supabase');
const { generateToken, successResponse, errorResponse } = require('../utils/helpers');

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, phone } = req.body;

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .or(`username.eq.${username},email.eq.${email}`)
            .single();

        if (existingUser) {
            return errorResponse(res, 'Username or email already exists', 400);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                username,
                email,
                password_hash: passwordHash,
                first_name: firstName,
                last_name: lastName,
                phone,
                role: 'student' // Default role
            })
            .select('id, username, email, first_name, last_name, role, avatar_url, created_at')
            .single();

        if (error) {
            console.error('Registration error:', error);
            return errorResponse(res, 'Failed to create user', 500);
        }

        // Generate token
        const token = generateToken(newUser);

        return successResponse(res, {
            user: newUser,
            token
        }, 'Registration successful', 201);

    } catch (error) {
        console.error('Register error:', error);
        return errorResponse(res, 'Registration failed', 500);
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            return errorResponse(res, 'Invalid username or password', 401);
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return errorResponse(res, 'Invalid username or password', 401);
        }

        // Generate token
        const token = generateToken(user);

        // Remove password from response
        delete user.password_hash;

        return successResponse(res, {
            user,
            token
        }, 'Login successful');

    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(res, 'Login failed', 500);
    }
};

/**
 * Get current user
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
    try {
        // User is already attached by auth middleware
        return successResponse(res, { user: req.user }, 'User retrieved successfully');
    } catch (error) {
        console.error('GetMe error:', error);
        return errorResponse(res, 'Failed to get user', 500);
    }
};

/**
 * Logout user (client-side should remove token)
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
    return successResponse(res, null, 'Logout successful');
};

module.exports = {
    register,
    login,
    getMe,
    logout
};
