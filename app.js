const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
// // konfigurasi flash
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const flash = require('connect-flash');
// konfigurasi mongodb
require('./utils/db');
const Contact = require('./model/Contact');
const methodOverride = require('method-override');

// konfigurasi express
const app = express();
const port = 3000;

// konfigurasi ejs
app.set('view engine', 'ejs');
app.use(expressLayouts); // third party middleware
app.use(express.static('public')); // built-in middleware
app.use(express.urlencoded({ extended: true })); // utk proses simpan

// konfigurasi method override
app.use(methodOverride('_method'));

// // konfigurasi flash
// app.use(cookieParser('secret'));
// app.use(
//     session({
//         cookie: { maxAge: 6000 },
//         secret: 'secret',
//         resave: true,
//         saveUninitialized: true,
//     })
// );
// app.use(flash);

// halaman home
app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: 'apip kurniawan',
            email: 'apip@gmail.com'
        },
        {
            nama: 'zaki',
            email: 'zaki@gmail.com'
        }
    ];
    res.render('index', {
        layout: 'layouts/main-layout',
        nama: 'apip kurniawan',
        mahasiswa,
        title: 'Halaman Home'
    });
});

// halaman about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Halaman About',
        layout: 'layouts/main-layout'
    });
})

// halaman contact
app.get('/contact', async (req, res) => {
    const contacts = await Contact.find();
    res.render('contact', {
        title: 'Halaman Contact',
        layout: 'layouts/main-layout',
        contacts
        // msg: req.flash('msg')
    });
})

// halaman tambah data
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout'
    });
})

// proses tambah data
app.post('/contact', [
    body('nama').custom(async (value) => {
        const duplikat = await Contact.findOne({ nama: value });
        if (duplikat) {
            throw new Error('Nama contact sudah digunakan!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'No Hp tidak valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        res.render('add-contact', {
            title: 'Form Tambah Data Contact',
            layout: 'layouts/main-layout',
            errors: errors.array()
        });
    } else {
        Contact.insertMany(req.body, (error, result) => {
            // kirimkan flash message
            // req.flash('msg', 'Data contact berhasil ditambahkan!');
            res.redirect('/contact');
        });
    }
})

// proses delete contact
app.delete('/contact', (req, res) => {
    const id = req.body._id.split(' ')[0];
    Contact.deleteOne({ _id: id }).then((result) => {
        // req.flash('msg', 'Data contact berhasil dihapus!');
        res.redirect('/contact');
    });
});

// halaman ubah data contact
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main-layout',
        contact
    });
})

// proses ubah data
app.put('/contact', [
    body('nama').custom(async (value, { req }) => {
        const duplikat = await Contact.findOne({ nama: value });
        if (value !== req.body.oldNama && duplikat) {
            throw new Error('Nama contact sudah digunakan!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'No Hp tidak valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        res.render('edit-contact', {
            title: 'Form Ubah Data Contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body
        });
    } else {
        const id = req.body._id.split(' ')[0];
        Contact.updateOne(
            { _id: id },
            {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    nohp: req.body.nohp
                }
            }
        ).then((result) => {
            // kirimkan flash message
            // req.flash('msg', 'Data contact berhasil diubah!');
            res.redirect('/contact');
        });
    }
})

// halaman detail contact
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render('detail', {
        title: 'Halaman Detail Contact',
        layout: 'layouts/main-layout',
        contact
    });
})

// halaman sembarang
app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>Page Not Found</h1>')
})

// konfigurasi express
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})