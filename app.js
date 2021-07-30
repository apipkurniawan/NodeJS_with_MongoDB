const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const flash = require('connect-flash');

const { addContact, deleteContact, updateContacts, loadContact, findContact, cekDuplikat } = require('./utils/contacts');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts); // third party middleware
app.use(express.static('public')); // built-in middleware
app.use(express.urlencoded({ extended: true })); // utk proses simpan

// konfigurasi flash
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
app.get('/contact', (req, res) => {
    const contacts = loadContact();
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
    body('nama').custom((value) => {
        const duplikat = cekDuplikat(value);
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
        addContact(req.body);
        // kirimkan flash message
        // req.flash('msg', 'Data contact berhasil ditambahkan!');
        res.redirect('/contact');
    }
})

// proses delete contact
app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    if (!contact) {
        res.status(404);
        res.send('<h1>404</h1>');
    } else {
        deleteContact(req.params.nama);
        // req.flash('msg', 'Data contact berhasil dihapus!');
        res.redirect('/contact');
    }
});

// halaman ubah data contact
app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main-layout',
        contact
    });
})

// proses ubah data
app.post('/contact/update', [
    body('nama').custom((value, { req }) => {
        const duplikat = cekDuplikat(value);
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
        updateContacts(req.body);
        // kirimkan flash message
        // req.flash('msg', 'Data contact berhasil diubah!');
        res.redirect('/contact');
    }
})

// halaman detail contact
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})