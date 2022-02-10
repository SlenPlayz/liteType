const mongoose = require("mongoose");
const Schema = mongoose.Schema

const NoteSchema = new Schema({
    type: String,
    owner: Array,
    editor: Array,
    viewer: Array,
    title: String,
    data: Object
});

const noteModel = mongoose.model('Note', NoteSchema);

module.exports = noteModel