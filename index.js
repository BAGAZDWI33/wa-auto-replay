const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

/* ===============================
   HELPER
================================ */
const delay = ms => new Promise(res => setTimeout(res, ms));

const fotoSalam = MessageMedia.fromFilePath('./lpk2.png');
const fotoreguler = MessageMedia.fromFilePath('./lpk.jpeg');
const fotoonline = MessageMedia.fromFilePath('./lpk3.jpeg');
const fotoregister = MessageMedia.fromFilePath('./lpk4.jpeg');
const fotosyarat = MessageMedia.fromFilePath('./lpk7.jpeg');

async function replyTyping(msg, text, media = null) {
    const chat = await msg.getChat();
    await chat.sendStateTyping();
    await delay(Math.floor(Math.random() * 2000) + 1500);

    if (media) {
        await chat.sendMessage(media, { caption: text });
    } else {
        await msg.reply(text);
    }
}

/* ===============================
   DATA SEMENTARA (TANPA DATABASE)
================================ */
const users = new Map();
// struktur:
// users.set(userId, { step: 'ASK_NAME_EMAIL', name: '', email: '' })

/* ===============================
   MODE DIAM
================================ */
const silentUsers = new Map();

function setSilent(userId) {
    silentUsers.set(userId, Date.now());

    setTimeout(async () => {
        silentUsers.delete(userId);
        await client.sendMessage(
            userId,
            'Terimakasih sudah menghubungi kami 😊 Apakah Hana bisa bantu lagi?'
        );
    }, 5 * 60 * 1000);
}

/* ===============================
   QR & READY
================================ */
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📱 Scan QR WhatsApp');
});

client.on('ready', () => {
    console.log('✅ Hana Aktif');
});

/* ===============================
   AUTO RESPON
================================ */
client.on('message', async msg => {

    if (msg.fromMe) return;

    const userId = msg.from;
    const text = msg.body.trim();

    if (silentUsers.has(userId)) return;

    /* ========= SALAM AWAL ========= */
    if (
        ['hai', 'halo', 'hallo', 'assalamualaikum'].includes(text.toLowerCase())
    ) {
        users.set(userId, { step: 'ASK_NAME_EMAIL' });

        return replyTyping(
            msg,
            'Halo Kak 😊\nSaya *Hana* dari *LPK Mitsu Gakuen*\n\n' +
            'Sebelum lanjut, mohon kirim data berikut ya:\n\n' +
            '*Nama:* \n*Email:* \n\nContoh:\nNama: Bagas\nEmail: bagas@gmail.com',
            fotoSalam
        );
    }

    /* ========= VALIDASI NAMA & EMAIL ========= */
    const user = users.get(userId);

    if (user && user.step === 'ASK_NAME_EMAIL') {
        const namaMatch = text.match(/nama\s*:\s*(.+)/i);
        const emailMatch = text.match(/email\s*:\s*(.+)/i);

        if (!namaMatch || !emailMatch) {
            return replyTyping(
                msg,
                '❗ Format belum sesuai ya Kak\n\n' +
                'Gunakan format:\n' +
                'Nama: Nama Lengkap\n' +
                'Email: email@gmail.com'
            );
        }

        user.name = namaMatch[1].trim();
        user.email = emailMatch[1].trim();
        user.step = 'DONE';

        users.set(userId, user);

        return replyTyping(
            msg,
            `Terima kasih Kak *${user.name}* 😊\n\n` +
            'Silakan pilih informasi berikut:\n' +
            '👉 *Kelas Reguler*\n' +
            '👉 *Kelas Online*\n' +
            '👉 *Syarat*\n' +
            '👉 *register*\n' +
            '👉 *Lokasi*\n' +
            '👉 *Media Sosial LpK*\n' +
            '👉 *Biaya*'
        );
    }

    /* ========= BLOK JIKA BELUM ISI DATA ========= */
    if (!user) {
        return replyTyping(
            msg,
            '🙏 Mohon kirim *Hai* terlebih dahulu untuk memulai percakapan ya Kak'
        );
    }

    /* ========= PROGRAM ========= */
    if (text.toLowerCase().includes('kelas reguler')) {
        return replyTyping(msg,

            '✨ *Kelas Reguler LPK Mitsu Gakuen* ✨\n' +
            'Solusi Terbaik Menuju Karier di Jepang 🇯🇵\n\n' +
            '🚀 *Ingin Bekerja ke Jepang? Mulai dari Sini!*\n' +
            'LPK Mitsu Gakuen membuka *Pendaftaran Kelas Reguler*.\n\n' +
            'Kami siapkan Kakak sampai *siap kerja di Jepang*:\n\n' +
            '✅ Durasi 6 bulan (Senin–Jumat)\n' +
            '✅ Gratis asrama & makan siang\n' +
            '✅ Bimbingan kerja & job matching sampai lulus\n' +
            '✅ Sensei bersertifikat minimal JLPT N4\n\n' +
            '🎯 Bidang kerja:\n' +
            'Kaigo • Konstruksi • Otomotif • Pertanian • Perhotelan\n\n' +
            '📌 *KUASAI BAHASA JEPANG, KUASAI PELUANG!*\n\n' +
            'Tertarik daftar, Kak?\n' +
            'Silakan kirim *Nama, Usia, dan Domisili* 😊', fotoreguler
        );
    }

    if (text.toLowerCase().includes('kelas online')) {
        return replyTyping(msg,
            '🔥 LPK Mitsu Gakuen: Kelas Online N5 & N3 Dibuka! 🔥\n' +
            '🇯🇵 Upgrade Level Jepang-mu Sampai N3 dari Rumah!\n\n' +
            'LPK Mitsu Gakuen menghadirkan Kelas Online N5 dan N3 untuk pendaftaran sekarang!Kenapa harus Kelas Online Mitsu Gakuen?\n' +
            '1. Kualitas Sensei Terjamin: Semua Sensei Kelas Online kami memiliki kualifikasi minimal JLPT N3.• Dibimbing langsung oleh Sudarta Sensei (Sertifikat JLPT N3) dan Arifin Sensei (Sertifikat JLPT N2)!.\n\n' +
            '2. Materi Intensif: Total 24 kali pertemuan untuk menguasai N5 hingga N3.\n\n' +
            '3. Solusi Karir: Cocok untuk kamu yang ingin kerja TG/Magang atau belajar sambil bekerja.\n' +
            'Daftar sekarang sebelum kuota penuh!\n', fotoonline

        );
    }

    if (text.toLowerCase().includes('register')) {
        return replyTyping(msg,
            '📄 ayo Daftar Segera Sebelum Kuota Penuh\n\n' +
            'Kalian bisa melakukan scan QR diatas atau melakukan klik link berikut:\n' +
            ' ini link', fotosyarat
        );
    }

    if (text.toLowerCase().includes('syarat')) {
        return replyTyping(msg,
            '📄 *Syarat Umum*\n\n' +
            '• Usia 18–28 tahun\n' +
            '* Tinggi badan min. 160 (Pria) & 150cm (Wanita).* Sehat Jasmani & Rohani. (Tidak bertindik dan bertato bagi pria)* KTP* KK* Akte kelahiran* Ijazas ,SD, SMP, SMK/SMA* Foto Background putih kemaja putih berdasi hitam dan berjas hitam (kumis dan jenggot wajib cukur)', fotoregister
        );
    }

    if (text.toLowerCase().includes('lokasi')) {
        return replyTyping(msg,
            'https://l.instagram.com/?u=https%3A%2F%2Fmaps.app.goo.gl%2Finrjb1fMithkc3AS8%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn-BrnALW8WiZB3Gbhcr6KM9pktn7m_35PZ1_S4zkbr04r-VUmSyIDIEO8d4c_aem_aHplFtWyqf6A0Phx5-Eo_w&e=AT0bRni-2qOGpKWGN9pBwqrMOn8xLHaPxZ8_dYI9F3vjgd8aLSwIFYkVhLzszYuu_9G0bJfT9WoQeL2EQvzvXjFBsa2XIeWz8GEt16vMoQ\n\n' +

            'Dukuh lokojoyo Desa Banyuputih Kecamatan Banyuputih, Batang, Jawa Tengah, Indonesia 51271'
        );
    }

    if (text.toLowerCase().includes('Media Sosial LpK')) {
        return replyTyping(msg,
            'https://www.instagram.com/p/DIfqcgnp1Uj/\n\n' +
            'https://www.tiktok.com/@marketing_mitsugakuen?_r=1&_t=ZS-92Tg0LJlgkn\n\n' +

            'Dukuh lokojoyo Desa Banyuputih Kecamatan Banyuputih, Batang, Jawa Tengah, Indonesia 51271'
        );
    }

    if (text.toLowerCase().includes('biaya')) {
        return replyTyping(msg,
            '💰 Untuk info biaya, silakan sebutkan:\n' +
            '👉 Kelas Reguler / Online\n' +
            '👉 Level N5 / N3'
        );
    }

    /* ========= DI LUAR DATA ========= */
    await replyTyping(msg, 'Team Hana akan menjawab pertanyaan Kakak 🙏');
    setSilent(userId);
});

/* ===============================
   START
================================ */
client.initialize();
