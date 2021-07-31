const mongoose = require('mongoose');

// membuat schema/tabel
const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true
    },
    nohp: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
});

module.exports = Contact;