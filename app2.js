const yargs = require('yargs');
const { deleteContact, listContact, simpanContact, detailContact } = require('./contacts2');

// menambah data
yargs.command({
    command: 'add',
    describe: 'menambahkan contact baru',
    builder: {
        nama: {
            describe: 'Nama lengkap',
            demandOption: true,
            type: 'string'
        },
        email: {
            describe: 'Email',
            demandOption: false,
            type: 'string'
        },
        noHp: {
            describe: 'No Hp',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        simpanContact(argv.nama, argv.email, argv.noHp);
    }
}).demandCommand();

// menampilkan data
yargs.command({
    command: 'list',
    describe: 'Menampilkan semua nama contact',
    handler() {
        listContact();
    }
});

// menampilkan detail
yargs.command({
    command: 'detail',
    describe: 'Menampilkan detail contact berdasarkan nama',
    builder: {
        nama: {
            describe: 'Nama lengkap',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        detailContact(argv.nama);
    }
}).demandCommand();

// menghapus data
yargs.command({
    command: 'delete',
    describe: 'Menghapus data contact berdasarkan nama',
    builder: {
        nama: {
            describe: 'Nama lengkap',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        deleteContact(argv.nama);
    }
}).demandCommand();

yargs.parse();