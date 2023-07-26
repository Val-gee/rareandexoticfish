const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => {
                return /^[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
            },
            message: `${this.email} is not a valid email address. Please try again.`
        },
    },
    password: {
        type: String,
        required: true,
    },
    adminAccess: {
        type: Boolean,
        required: true,
        default: false
    }
});

userSchema.pre('save', async (next) =>{
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.isCorrectpassword = async (password) => {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('user', userSchema);

module.exports = User;