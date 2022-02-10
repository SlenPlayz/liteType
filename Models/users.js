const mongoose = require("mongoose");
const Schema = mongoose.Schema

const UserSchema = new Schema({
    _id: Number,
    email: String,
    notes: Array
}, { _id: false });

const userModel = mongoose.model('User', UserSchema);

module.exports = userModel