// Leaflet Harita Başlangıcı
let map; // Haritayı global olarak tanımlıyoruz

function initializeMap() {
    // Haritayı oluştur ve dünya geneline odakla
    map = L.map('map').setView([20, 0], 2); // 20 derece enlem, 0 derece boylamdan başlar

    // Harita katmanını ekle
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.getContainer().style.display = 'none'; // Başlangıçta haritayı gizliyoruz
}

initializeMap(); // Haritayı oluştur ve başlat

// API Anahtarları
const UNSPLASH_ACCESS_KEY = 'RIqA1kxc-rvoafwDHZT9GqS23XtVJqd4vCFO4u1-CIQ';
const OPENCAGE_API_KEY = '46a8572fe8a84627bb9e8d2d078eedcd';

let targetLatLng, targetCity, playerMarker;
let attemptsLeft = 3;

// Animasyon için el divlerini seçme
const leftHand = document.getElementById("leftHand");
const rightHand = document.getElementById("rightHand");

// Başlangıç Animasyonunu Başlatma
function startHandAnimation() {
    // Eller birbirine yaklaşır
    setTimeout(() => {
        leftHand.style.transform = "translateX(130px) rotate(0)";
        rightHand.style.transform = "translateX(-130px) rotate(0)";
    }, 500);

    // El sıkışma hareketi
    setTimeout(() => {
        leftHand.style.transform = "translateX(60px) rotate(0)";
        rightHand.style.transform = "translateX(-60px) rotate(0)";
    }, 1500);

    // Eller sıkıştıktan sonra gizle ve haritayı göster
    setTimeout(() => {
        leftHand.style.display = "none";
        rightHand.style.display = "none";
        document.getElementById("map").style.display = "block"; // Haritayı görünür yap
        map.invalidateSize(); // Haritanın boyutunu güncelle (Gizli durumdan çıktığı için boyut güncellemeye ihtiyaç var)
        initializeGame();
    }, 2500);
}

// Oyunu başlat ve hedef belirle
async function initializeGame() {
    attemptsLeft = 3; // Tahmin haklarını sıfırla
    await setRandomCityTarget();
    await showHintImage();
    enableMapClick(); // Kullanıcının haritada tıklama yapabilmesi için
}

// Kullanıcının haritada yer işaretleyebilmesi için tıklama etkinleştir
function enableMapClick() {
    map.on('click', (e) => {
        if (attemptsLeft > 0) {
            const { lat, lng } = e.latlng;
            if (playerMarker) map.removeLayer(playerMarker); // Önceki işareti kaldır
            playerMarker = L.marker([lat, lng]).addTo(map); // Yeni işaret koy
            checkDistance(lat, lng); // Mesafeyi kontrol et
        } else {
            alert("Tahmin haklarınız tükendi. Yeniden başlatmak için 'Oyunu Başlat' butonuna basın.");
        }
    });
}

// Rastgele bir şehir seç ve hedef konumu ayarla
async function setRandomCityTarget() {
    try {
        let cityFound = false;
        while (!cityFound) {
            const lat = (Math.random() * 90 - 45).toFixed(4);
            const lng = (Math.random() * 180 - 90).toFixed(4);
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}`);
            const data = await response.json();

            if (data && data.results && data.results.length > 0) {
                const cityData = data.results[0].components;
                targetCity = cityData.city || cityData.town || cityData.village || cityData.state || cityData.country;
                if (targetCity) {
                    targetLatLng = { lat: parseFloat(lat), lng: parseFloat(lng) };
                    cityFound = true;
                    console.log(`Hedef şehir: ${targetCity} (${lat}, ${lng})`);
                    alert("Hedef bir şehir belirlendi! Şehir bulmaya çalışın!");
                }
            }
        }
    } catch (error) {
        console.error("Hedef şehir belirlenirken hata oluştu:", error);
    }
}

// Unsplash API'sini kullanarak görsel alma
async function getCityImage(city) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${city}&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        
        if (data.results.length > 0) {
            return data.results[0].urls.small;
        }
    } catch (error) {
        console.error("Görsel alınırken hata oluştu:", error);
    }
    return null;
}

// İpucu görselini gösterme
async function showHintImage() {
    if (targetCity) {
        let imageUrl = await getCityImage(targetCity);
        
        // Eğer şehir için görsel bulunamazsa genel bir şehir görseli getir
        if (!imageUrl) {
            console.log(`"${targetCity}" için görsel bulunamadı, genel şehir görseli alınıyor.`);
            imageUrl = await getCityImage("city");
        }

        if (imageUrl) {
            clearOldHintImages();
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = `İpucu: ${targetCity}`;
            imgElement.style.width = '300px';
            document.body.appendChild(imgElement);
        } else {
            console.log("Genel bir şehir görseli de bulunamadı.");
        }
    }
}

// Eski ipucu görsellerini kaldırma
function clearOldHintImages() {
    const oldImages = document.querySelectorAll("img[alt^='İpucu']");
    oldImages.forEach(img => img.remove());
}

// Mesafeyi kontrol et ve kullanıcıya bilgi ver
function checkDistance(playerLat, playerLng) {
    const distance = map.distance([playerLat, playerLng], [targetLatLng.lat, targetLatLng.lng]) / 1000;
    attemptsLeft--;
    alert(`Hedefe yaklaşık ${distance.toFixed(2)} km uzaklıktasınız. Kalan tahmin hakkınız: ${attemptsLeft}`);

    if (attemptsLeft === 0) {
        alert(`Tahmin haklarınız bitti! Hedef şehir: ${targetCity}`);
    }
}

// "Oyunu Başlat" Butonuna Tıklayınca Animasyonu Başlat
document.getElementById('startGame').addEventListener('click', () => {
    attemptsLeft = 3;
    startHandAnimation();
});

