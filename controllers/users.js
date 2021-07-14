const Users = require('../model/users');
const { HttpCode } = require('../helpers/httpCode');
const User = require('../model/schema/user');
const jwt = require('jsonwebtoken');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const EmailService = require('../services/email')
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
    
    const user = await Users.findByEmail(req.body.email);
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'error',
            code: HttpCode.CONFLICT,
            message: 'Email in use'
        })
    };
    try {
        const newUser = await User.create(req.body);
        const { email, avatarUrl, subscription, verifyToken } = newUser;
        try {
            const emailService = new EmailService(process.env.NODE_ENV);
            await emailService.sendVerifyEmail(verifyToken, email);
        } catch (e) {
            console.log(e.message);
        }
        return res.status(HttpCode.CREATED).json({
            status: 'success',
            code: HttpCode.CREATED,
            data: {
                email: email,
                subscription: subscription,
                avatar: avatarUrl,
            }
        })

    } catch (err) {
        next(err)
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validePassword(password);
    if (!user || !isValidPassword || !user.verify) {
        return res.status(HttpCode.UNAUTHORIZED).json({
            status: 'error',
            code: HttpCode.UNAUTHORIZED,
            message: 'Email or password is wrong'
        })
    };
    const payload = {
        id: user.id,
    };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(user.id , token);
    return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { token },
    });
};

const logout = async (req, res, next) => {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
};

const current = async (req, res, next) => {
    const { email, subscription } = req.user;
    return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {email, subscription}
    })
};

const updateAvatar = async (req, res, next) => {
    const { id } = req.user;
    const avatarUrl = await saveAvatar(req);
    await Users.updateAvatar(id, avatarUrl)
    return res
        .status(HttpCode.OK)
        .json({
            status: 'success',
            code: HttpCode.OK,
            data: { avatarUrl }
        })
};
const saveAvatar = async (req) => {
    const FOLDER_AVATARS = process.env.FOLDER_AVATARS;
    const pathFile = req.file.path;
    const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`;
    const img = await jimp.read(pathFile);
    await img
        .autocrop()
        .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
        .writeAsync(pathFile);
    try {
        await fs.rename(
        pathFile,
        path.join(process.cwd(), 'public', FOLDER_AVATARS, newNameAvatar),
        ()=>{},
    );
    } catch (e) {
        console.log(e.message);
    };
    const oldAvatar = req.user.avatarUrl;
    if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
        await fs.unlink(path.join(process.cwd(), 'public', oldAvatar), ()=>{})
    }
    return path.join(FOLDER_AVATARS, newNameAvatar)
};


const verify = async (req, res, next) => {
    try {
        const user = await Users.findByVerifyToken(req.params.verificationToken);
        console.log(req.params);
        if (user) {
            await Users.updateVerifyToken(user.id, true, null)
            return res.status(HttpCode.OK).json({
                status: 'success',
                code: HttpCode.OK,
                data: { message: 'Verification success' },
            })
        };
        return res.status(HttpCode.BAD_REQUEST).json({
            status: 'error',
            code: HttpCode.BAD_REQUEST,
            message: 'Invalid token'
        });
    } catch (e) {
        next(e)
    }
};

const repeatEmailVerify = async (req, res, next) => {
    try {
        const user = await Users.findByEmail(req.body.email);
        if (user) {
            const { name, verifyTokenEmail, email } = user;
            const emailService = new EmailService(process.env.NODE_ENV);
            await emailService.sendVerifyEmail(verifyTokenEmail, email, name);
            return res.status(HttpCode.OK).json({
                status: 'success',
                code: HttpCode.OK,
                data: { message: 'Verification email resubmitted' },
            })
        }
        return res.status(HttpCode.NOT_FOUND).json({
            status: 'error',
            code: HttpCode.NOT_FOUND,
            message: 'User not found'
        });
    } catch (e) {
        next(e)
    }
};

module.exports = {
    login,
    signup,
    logout,
    current,
    updateAvatar,
    verify,
    repeatEmailVerify
};