from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def get_trending_hashtags():
    # ChromeDriver yolunu belirt
    driver_path = "CHROMEDRIVER_YOLUNU_BURAYA_YAZ"
    driver = webdriver.Chrome(driver_path)

    try:
        # Twitter'a git ve keşfet sayfasını aç
        driver.get("https://x.com/explore/tabs/trending")

        # Sayfanın yüklenmesi için zaman ver
        time.sleep(5)

        # Trend etiketlerini seç
        
        trends = driver.find_elements(By.CSS_SELECTOR, "span.css-css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3")
        
        hashtags = []
        for trend in trends:
            text = trend.text
            if text.startswith("#"):  # Yalnızca hashtag'leri al
                hashtags.append(text)
        
        return hashtags

    finally:
        driver.quit()

# Trend etiketlerini çek
trend_hashtags = get_trending_hashtags()
print("Trend Hashtagler:", trend_hashtags)
