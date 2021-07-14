const User = require('./schema/user');

const findById = async (id) => {
    return await User.findById(id)
};
const findByEmail = async (email) => {
    return await User.findOne({ email })
};
const findByVerifyToken= async (token) => {
    return await User.findOne({ verifyToken: token })
};
const createUser = async (userOptions) => {
    const user = new User(userOptions);
    return await user.save()
};
const updateToken = async (id, token) => {
    return await User.updateOne({ _id: id }, { token })
};
const updateAvatar = async (id, avatarUrl) => {
    return await User.updateOne({ _id: id }, { avatarUrl })
};
const updateVerifyToken = async (id, verify, verifyToken) => {
    return await User.updateOne({ _id: id }, { verify, verifyToken: verifyToken })
};
module.exports = {
    findById,
    findByEmail,
    createUser,
    updateToken,
    updateAvatar,
    findByVerifyToken,
    updateVerifyToken
};