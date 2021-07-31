const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kontak', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// // menambah 1 data
// const contact1 = new Contact({
//     nama: 'panjul',
//     nohp: '082576987980',
//     email: 'panjul@gmail.com'
// });

// // simpan ke collection
// contact1.save().then((contact) => console.log(contact));