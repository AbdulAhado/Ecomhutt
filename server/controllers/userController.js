import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import generateOTP from '../utils/generateOTP.js';
import sendEmail from '../utils/sendEmail.js';
import { getEmailTemplate } from '../utils/emailTemplate.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                res.status(403).json({ message: 'Account not verified. Please verify your email.', notVerified: true, email: user.email });
                return;
            }

            const token = generateToken(user._id);

            // Set httpOnly cookie — JS cannot read this, safe from XSS
            // In production (cross-origin), sameSite must be 'none' with secure:true
            // In dev (same-origin localhost), 'lax' is fine
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                cart: user.cart,
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            if (!userExists.isVerified) {
                // Allow re-registering or just say user exists. We'll just say exists for simplicity.
                res.status(400).json({ message: 'User already exists. If not verified, please login to verify.' });
                return;
            }
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

        const user = await User.create({
            name,
            email,
            password,
            otp,
            otpExpiry,
            isVerified: false,
        });

        if (user) {
            // Send OTP via email
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'EcomHutt - Verify your account',
                    message: getEmailTemplate(user.name, otp, 'verification'),
                });
            } catch (err) {
                console.error('Email sending failed', err);
                // Continue anyway, user can resend
            }

            res.status(201).json({
                message: 'Registration successful. Please verify your email.',
                email: user.email,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = generateToken(user._id);

        // Set httpOnly cookie on OTP verification (user's first login)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: 'Email verified successfully',
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Resend OTP
// @route   POST /api/users/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        try {
            await sendEmail({
                email: user.email,
                subject: 'EcomHutt - Your new verification code',
                message: getEmailTemplate(user.name, otp, 'verification'),
            });
        } catch (err) {
            console.error('Email sending failed', err);
        }

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Forgot Password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if user exists or not for security, but here we can just say sent.
            // But for simplicity in UI, we return 404.
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        try {
            await sendEmail({
                email: user.email,
                subject: 'EcomHutt - Password Reset OTP',
                message: getEmailTemplate(user.name, otp, 'reset'),
            });
        } catch (err) {
            console.error('Email sending failed', err);
        }

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reset Password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Set new password. Pre-save hook will hash it.
        user.password = newPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful. Please login.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Sync user cart
// @route   POST /api/users/cart
// @access  Private
const syncCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.cart = req.body.cart || [];
            await user.save();
            res.json({ message: 'Cart synced successfully', cart: user.cart });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create user (admin only)
// @route   POST /api/users/create
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'lister',
            isVerified: true, // Admins create verified users
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all customers (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            if (req.body.address) {
                user.address = {
                    street: req.body.address.street || user.address?.street,
                    city: req.body.address.city || user.address?.city,
                    postalCode: req.body.address.postalCode || user.address?.postalCode,
                    country: req.body.address.country || user.address?.country,
                };
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                address: updatedUser.address,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getHighestRole = (rolesList = []) => {
    if (rolesList.includes('admin')) return 'admin';
    if (rolesList.includes('lister')) return 'lister';
    return 'customer';
};

// @desc    Update user roles (supports multiple roles: e.g. ['customer', 'lister'])
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const { role, roles } = req.body;
        const user = await User.findById(req.params.id);
        if (user) {
            let updatedRoles = [];
            if (Array.isArray(roles) && roles.length > 0) {
                updatedRoles = roles.filter(r => ['admin', 'lister', 'customer'].includes(r));
            } else if (role && ['admin', 'lister', 'customer'].includes(role)) {
                const currentRoles = user.roles && user.roles.length > 0 ? user.roles : [user.role || 'customer'];
                if (currentRoles.includes(role)) {
                    // Toggle off if more than 1 role
                    updatedRoles = currentRoles.length > 1 ? currentRoles.filter(r => r !== role) : currentRoles;
                } else {
                    // Add role (up to 2 roles or as selected)
                    updatedRoles = [...currentRoles, role];
                }
            } else {
                updatedRoles = user.roles || [user.role || 'customer'];
            }

            if (updatedRoles.length === 0) updatedRoles = ['customer'];

            user.roles = updatedRoles;
            user.role = getHighestRole(updatedRoles);
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                roles: updatedUser.roles,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Toggle user verification status (Admin can verify without OTP)
// @route   PUT /api/users/:id/verify
// @access  Private/Admin
const toggleUserVerification = async (req, res) => {
    try {
        const { isVerified } = req.body;
        const user = await User.findById(req.params.id);
        if (user) {
            user.isVerified = isVerified !== undefined ? isVerified : !user.isVerified;
            if (user.isVerified) {
                user.otp = undefined;
                user.otpExpiry = undefined;
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isVerified: updatedUser.isVerified,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    createUser,
    getAllUsers,
    deleteUser,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    logoutUser,
    syncCart,
    updateUserRole,
    toggleUserVerification
};
