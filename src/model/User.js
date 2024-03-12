const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;
// const slug = require('mongoose-slug-generator')
// mongoose.plugin(slug)



const User = new Schema({
    email: {
        type: String,
        unique: [true, "Email đã được sử dụng"],
        required: [true, "Vui lòng nhập email"],
        lowercase: true,
        validate:{
            validator: validator.isEmail,
            message: "Email không hợp lệ !"
        }
    },
    fullname: {
        type: String,
        required: [true, "Vui lòng nhập tên"],
    },
    password: {
        type: String,
        required: [true, "Vui lòng nhập mật khẩu"],
        minLength: [8, "Mật khẩu ít nhất 8 kí tự"],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});

User.methods.comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
  };

User.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
  
    // If user has already created or has changed password
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });


module.exports = mongoose.model('User', User);