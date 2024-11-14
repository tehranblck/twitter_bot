const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Dinamik zaman damgası ve mesajla tweet gönderme fonksiyonu
async function tweetMessage() {
    try {
        // Mevcut saat ve dakika
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        // Dinamik tweet içeriği
        const tweetContent = `🌍 Supporting sustainability at #COP29! Saytyarat offers fast, affordable web solutions for eco-conscious brands. Check us out at https://saytyarat.com/ #COP29BAKU #AZERBAIJAN ⏰ Time: ${timeString}`;

        // Tweet atma işlemi
        const tweet = await client.v2.tweet(tweetContent);
        console.log('Tweet atıldı:', tweet);
    } catch (error) {
        console.error('Tweet atma hatası:', error);
    }
}

// Tweet atma aralığı
const interval = 4 * (60 * 60 * 1000); // Belirlediğin süre

setInterval(tweetMessage, interval);

// Bot ilk açıldığında bir kere çalıştır
tweetMessage();
