const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs'); // Dosya okuma için gerekli
require('dotenv').config();

const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Dinamik zaman damgası ve JSON içeriği ile tweet gönderme fonksiyonu
async function tweetMessage() {
    try {
        // Mevcut saat ve dakika
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        // JSON dosyasını oku
        const tags = JSON.parse(fs.readFileSync('hashtags.json', 'utf-8'));

        // İlk 3 etiketi al (uzunluğu kontrol ederek)
        const selectedTags = tags.slice(0, 3).join(' '); // İlk 3 etiketi birleştir

        // Dinamik tweet içeriği
        const tweetContent = `🚀 Saytyarat: Your partner in fast, affordable, and professional website solutions! 🌐 Whether you're a startup or an established business, we craft websites that fit your needs and budget. Check us out: https://saytyarat.com/ ⏰ Time: ${timeString} ${selectedTags}`;

        // Tweet atma işlemi
        const tweet = await client.v2.tweet(tweetContent);
        console.log('Tweet atıldı:', tweet);
    } catch (error) {
        console.error('Tweet atma hatası:', error);
    }
}

// Tweet atma aralığı
const interval = 3 * (60 * 60 * 1000); // 3 saat

setInterval(tweetMessage, interval);

// Bot ilk açıldığında bir kere çalıştır
tweetMessage();
