const mongoose = require ('mongoose');
const gravatar = require('gravatar');
const { Schema, model, SchemaTypes } = mongoose;
const bcrypt = require('bcryptjs');


const userSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        token: {
            type: String,
            default: null,
        },
        owner: {
            type: SchemaTypes.ObjectId,
            ref: 'user',
        },
        avatarUrl: {
            type: String,
            default: function () {
                return gravatar.url(this.email, { s: 250 }, true)
            }
        }
    },
    {
        versionKey: false,
        timestamps: true
    },
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(6);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next()
});
userSchema.methods.validePassword = async function (password) {
    return await bcrypt.compare(String(password), this.password)
};
const User = model('user', userSchema);
module.exports = User;