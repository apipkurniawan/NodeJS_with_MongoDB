const { tulisPertanyaan, simpanContact } = require('./contacts1');

const main = async () => {
    const nama = await tulisPertanyaan('Masukan Nama anda : ');
    const email = await tulisPertanyaan('Masukan Email anda : ');
    const noHp = await tulisPertanyaan('Masukan No. Hp anda : ');

    simpanContact(nama, email, noHp);
}

main();