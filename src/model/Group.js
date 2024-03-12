const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;
// const slug = require('mongoose-slug-generator')
// mongoose.plugin(slug)



const Group = new Schema({
    name:{
        type: String,
        required: [true, "Nhập tên nhóm"]
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String
    }
}, {
    timestamps: true,
});



module.exports = mongoose.model('Group', Group);