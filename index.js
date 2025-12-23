const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(), // SIMPAN SESSION
    puppeteer: { headless: true }
});

// QR
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan QR WhatsApp');
});

// Ready
client.on('ready', () => {
    console.log('Bot WhatsApp Aktif');
});

// AUTO REPLY
client.on('message', async msg => {
    const text = msg.body.toLowerCase();

    if (text === 'halo' || text === 'hai') {
        msg.reply('Halo 👋 Ada yang bisa saya bantu?');
    }
    else if (text.includes('harga')) {
        msg.reply('Untuk info harga silakan hubungi admin 😊');
    }
    else if (text.includes('alamat')) {
        msg.reply('📍 Kami berlokasi di Bekasi');
    }
    else if (text === 'jam buka') {
        msg.reply('⏰ Jam buka: Senin–Jumat 08.00–17.00');
    } else if (text === 'badminton') {
        msg.reply('🏸 Gas kelapangan kuy');
    } else if (text === 'udah makan belum')
        msg.reply('🍽️ Belum nih, kamu?');
});

client.initialize();
