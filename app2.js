const yargs = require('yargs');
const { simpanContact } = require('./contacts2');

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
});

yargs.parse();