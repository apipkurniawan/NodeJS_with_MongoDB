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

const simpanContact = (nama, email, noHp) => {
    const contact = { nama, email, noHp };
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer);

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
    simpanContact
}