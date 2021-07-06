const validator = require('validator');
const fs = require('fs');
const chalk = require('chalk');

// membuat folder data jika belum ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

// membuat file contacts.json jika belum ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

const listContact = () => {
    const contacts = loadContact();
    console.log(chalk.cyan.inverse.bold('Daftar Kontak : '));
    contacts.forEach((contact, i) => {
        console.log(`${i + 1}. ${contact.nama}`)
    });
}

const detailContact = (nama) => {
    const contacts = loadContact();

    if (nama) {
        const contact = contacts.find(c => c.nama.toLowerCase() === nama.toLowerCase());
        if (!contact) {
            console.log(chalk.red.inverse.bold('Nama tidak ada di Kontak!'));
            return;
        }

        console.log(chalk.cyan.inverse.bold('Detail Kontak : '));
        console.log(`Nama : ${contact.nama}`);
        console.log(`Email : ${contact.email}`);
        console.log(`No. Hp : ${contact.noHp}`);
    } else {
        console.log(chalk.red.inverse.bold('Nama belum diisi!'));
    }
}

const deleteContact = (nama) => {
    const contacts = loadContact();

    if (nama) {
        const contact = contacts.find(c => c.nama.toLowerCase() === nama.toLowerCase());
        if (!contact) {
            console.log(chalk.red.inverse.bold('Nama tidak ada di Kontak!'));
            return;
        }

        const newContacts = contacts.filter(e => e.nama.toLowerCase() !== nama.toLowerCase());
        fs.writeFileSync('data/contacts.json', JSON.stringify(newContacts));
        console.log(chalk.green.inverse.bold(`Data Kontak dengan nama ${nama} berhasil dihapus!`));
    } else {
        console.log(chalk.red.inverse.bold('Nama belum diisi!'));
    }
}

const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}

const simpanContact = (nama, email, noHp) => {
    const contact = { nama, email, noHp };
    const contacts = loadContact();

    // cek duplikat
    if (nama) {
        const duplikat = contacts.find((data) => data.nama === nama);
        if (duplikat) {
            console.log(chalk.red.inverse.bold('perhatian, Nama yang anda masukan sudah ada!'));
            return;
        }
    }

    // cek email
    if (email) {
        if (!validator.isEmail(email)) {
            console.log(chalk.red.inverse.bold('perhatian, Email yang anda masukan tidak valid!'));
            return;
        }
    }

    // cek no hp
    if (noHp) {
        if (!validator.isMobilePhone(noHp, 'id-ID')) {
            console.log(chalk.red.inverse.bold('perhatian, No. HP yang anda masukan tidak valid!'));
            return;
        }
    }

    contacts.push(contact);

    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
    console.log(chalk.green.inverse.bold('terimakasih telah memasukan data!'));
}

module.exports = {
    deleteContact,
    simpanContact,
    listContact,
    detailContact
}