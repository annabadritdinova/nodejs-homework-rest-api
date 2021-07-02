const Users = require('../model/users');
const { HttpCode } = require('../helpers/httpCode');
const User = require('../model/schemas/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'error',
            code: HttpCode.CONFLICT,
            message: 'Email in use'
        })
    };
    try {
        const newUser = await User.create(req.body);
        return res.status(HttpCode.CREATED).json({
            status: 'success',
            code: HttpCode.CREATED,
            data: {
                email: newUser.email,
                subscription: newUser.subscription,
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
    if (!user || !isValidPassword) {
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

module.exports = {
    login,
    signup,
    logout,
    current,
};