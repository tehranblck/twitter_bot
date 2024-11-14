const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Azerbaycan'ın WOEID değeri
const AZERBAIJAN_WOEID = 23424741;

// İngilizce ve Azerice sırayla paylaşım için kontrol değişkeni
let isEnglish = true;

// Trend olan hashtag'leri alma fonksiyonu
async function getTrendingHashtags() {
    try {
        const trends = await client.v1.trendsByPlace(AZERBAIJAN_WOEID);
        const hashtags = trends[0].trends
            .filter(trend => trend.name.startsWith('#'))
            .map(trend => trend.name);
        return hashtags;
    } catch (error) {
        console.error('Trendleri alma hatası:', error);
        return [];
    }
}

// Tweet gönderme fonksiyonu
async function tweetMessage() {
    try {
        const hashtags = await getTrendingHashtags();
        if (hashtags.length === 0) {
            console.log('Trend olan hashtag bulunamadı.');
            return;
        }

        // Rastgele bir hashtag seç
        const randomHashtag = hashtags[Math.floor(Math.random() * hashtags.length)];

        // Dil seçimine göre dinamik tweet içeriği
        let tweetContent;
        if (isEnglish) {
            tweetContent = `🌍 Discussing ${randomHashtag}! Saytyarat offers fast and affordable web solutions for eco-conscious brands. Learn more at https://saytyarat.com/`;
        } else {
            tweetContent = `🌍 ${randomHashtag} haqqında danışırıq! Saytyarat, ekoloji dəyərlərə sahib markalar üçün sürətli və sərfəli veb həllər təklif edir. Daha ətraflı məlumat üçün: https://saytyarat.com/`;
        }

        // Tweet gönderme işlemi
        const tweet = await client.v2.tweet(tweetContent);
        console.log('Tweet atıldı:', tweet);

        // Sırayla dil değiştirme
        isEnglish = !isEnglish;
    } catch (error) {
        console.error('Tweet atma hatası:', error);
    }
}

// Tweet atma aralığı (örneğin, her 4 saatte bir)
const interval = 4 * 60 * 60 * 1000;

setInterval(tweetMessage, interval);

// Bot ilk açıldığında bir kere çalıştır
tweetMessage();
