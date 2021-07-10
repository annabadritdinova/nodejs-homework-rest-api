const User = require('./schema/user');

const findById = async (id) => {
    return await User.findById(id)
};
const findByEmail = async (email) => {
    return await User.findOne({ email })
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
module.exports = {
    findById,
    findByEmail,
    createUser,
    updateToken,
    updateAvatar
};