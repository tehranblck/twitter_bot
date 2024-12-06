const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs'); // Dosya işlemleri için gerekli

const username = 'tehran_blck';
const password = 'nonametehT1717';

// Etiketlerin saklanacağı array
const tags = [];

// İşlemi gerçekleştiren ana fonksiyon
async function startBrowserWithProfile() {
    const userProfile = 'C:/Users/Asus Vivobook/AppData/Local/Google/Chrome/User Data/Profile 2';

    let options = new chrome.Options();
    options.addArguments('--headless'); // Headless mod
    options.addArguments('--no-sandbox'); // Sandbox'ı devre dışı bırak
    options.addArguments('--disable-dev-shm-usage'); // Bellek kullanımı için
    options.addArguments(`--user-data-dir=${userProfile}`);
    options.addArguments('--profile-directory=Default');

    // Tarayıcıyı başlat
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('https://twitter.com');
        await driver.sleep(5000);

        // Giriş yapılmış mı kontrol et
        const isLoggedIn = await driver.findElements(By.css('a[data-testid="AppTabBar_Explore_Link"]'));
        if (isLoggedIn.length > 0) {
            console.log("Zaten giriş yapılmış.");
        } else {
            console.log("Giriş yapılmamış. Giriş işlemi başlatılıyor...");

            const signinButton = await driver.findElement(By.css('a[data-testid="loginButton"]'));
            await signinButton.click();

            await driver.wait(until.elementLocated(By.css('input[name="text"]')), 5000);
            const usernameField = await driver.findElement(By.css('input[name="text"]'));
            await usernameField.sendKeys(username);

            const nextButton = await driver.findElement(By.css('.css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-ywje51.r-184id4b.r-13qz1uu.r-2yi16.r-1qi8awa.r-3pj75a.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l'));
            await nextButton.click();

            await driver.wait(until.elementLocated(By.css('input[name="password"]')), 5000);
            const passwordField = await driver.findElement(By.css('input[name="password"]'));
            await passwordField.sendKeys(password);

            const loginButton = await driver.findElement(By.css('div[data-testid="LoginForm_Login_Button"]'));
            await loginButton.click();

            await driver.sleep(5000);
        }

        // Keşfet sayfasına git
        const exploreUrl = 'https://x.com/explore';
        await driver.get(exploreUrl);
        await driver.sleep(5000);

        // `#` ile başlayan etiketleri seç ve array'e ekle
        const hashtags = await driver.findElements(By.xpath("//span[contains(text(), '#')]"));
        console.log("Bulunan etiketler:");
        for (let hashtag of hashtags) {
            const text = await hashtag.getText();
            if (text) {
                tags.push(text); // Etiketi array'e ekle
                console.log(text); // Konsola yazdır
            }
        }

        console.log("Tüm etiketler:", tags);

        // Veriyi JSON dosyasına kaydet
        fs.writeFileSync('hashtags.json', JSON.stringify(tags, null, 2), 'utf-8');
        console.log("Veriler 'hashtags.json' dosyasına kaydedildi.");
    } catch (error) {
        console.error('Bir hata oluştu:', error);
    } finally {
        console.log("İşlem tamamlandı.");
        await driver.quit();
    }
}

// Her 3 saatte bir işlemi tekrar eden zamanlayıcı
const interval = 3 * 60 * 60 * 1000; // 3 saat
setInterval(startBrowserWithProfile, interval);

// İlk çağrı
startBrowserWithProfile();
