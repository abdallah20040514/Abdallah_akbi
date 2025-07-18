// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد CORS لقبول الطلبات من أي مصدر (يمكنك تخصيصه لاحقاً)
app.use(cors());
app.use(bodyParser.json());

// بيانات البوت
const BOT_TOKEN = '8111306142:AAGsWpJBKTx2ys5kFQPRyT_CAFVPpH6GpQQ';
const CHAT_ID = '5968641533';

app.post('/api/send-message', async (req, res) => {
    const { firstName, lastName, phone, email, message } = req.body;
    if (!firstName || !lastName || !phone || !email || !message) {
        return res.status(400).json({ ok: false, error: 'جميع الحقول مطلوبة' });
    }
    const text =
        '📝 طلب حجز جديد عبر الموقع:\n' +
        'الاسم: ' + firstName + '\n' +
        'اللقب: ' + lastName + '\n' +
        'رقم الهاتف: ' + phone + '\n' +
        'البريد الإلكتروني: ' + email + '\n' +
        'الرسالة: ' + message;
    try {
        const tgResp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text })
        });
        const tgData = await tgResp.json();
        if (tgData.ok) {
            res.json({ ok: true });
        } else {
            res.status(500).json({ ok: false, error: 'فشل إرسال الرسالة إلى تيليجرام', tg: tgData });
        }
    } catch (err) {
        res.status(500).json({ ok: false, error: 'خطأ في الاتصال بتيليجرام', details: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Telegram Bot API relay is running.');
});

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});
