# Karanix Backend

## Başlangıç

env dosyası oluşturulduktan sonra npm run seed ile mongodb ve test verileri oluşturulur. npm install backend ayağa kaldırılır. Backendde olan endpointler alt kısımda yazıyor. Ekstra olarak aklıma gelenleri de ekledim. Case dosyasında olanların tümünü ekledim. Bazı eksik gördüğüm kısımlarda kendim yaptım veya istenildiği gibi bıraktım. Sabit değerleri operations/constants içinde ki scripte koydum. Araç hareket testi için npm run test:vehicle komutu ile aktif olan operasyonlardaki araçlara heartbeat gönderilebilir. ./test-notification.sh ile düşük checkin notification test edilebilir.

### Gereksinimler
- Node.js 18+
- MongoDB 4.4+

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenleyin: MONGO_URI ve JWT_SECRET

# Veritabanını seed et
npm run seed

# Uygulamayı başlat
npm run start:dev
```

Uygulama `http://localhost:3001/api` adresinde çalışır.

## Environment Variables

`.env` dosyası oluşturun:

```env
MONGO_URI=mongodb://localhost:27017/karanix
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001

# Logging (opsiyonel)
LOG_DIR=logs
LOG_LEVEL=info
```

### Logging Ayarları

- `LOG_DIR`: Log dosyalarının yazılacağı dizin (varsayılan: `logs`)
- `LOG_LEVEL`: Log seviyesi - `error`, `warn`, `info`, `debug`, `verbose` (varsayılan: `info`)

Log dosyaları otomatik olarak `logs/` dizininde oluşturulur:
- `error.log`: Sadece hata logları
- `combined.log`: Tüm log seviyeleri
- `http.log`: HTTP istek logları

Her dosya maksimum 5MB boyutunda olabilir ve 5 dosya saklanır (rotation).

## Veritabanı Seed

```bash
npm run seed
```

Seed script şunları oluşturur:
- Kullanıcı: `admin` / `password`
- Örnek lokasyonlar, müşteriler, araçlar, operasyonlar ve yolcular

## API Endpoints

**Base URL:** `http://localhost:3001/api`

### Authentication

```bash
POST /api/auth/login
{
  "username": "admin",
  "password": "password"
}

# Response: { "access_token": "..." }
# Sonraki isteklerde: Authorization: Bearer <token>
```

### Operasyonlar

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/operations?date=YYYY-MM-DD&status=active` | Operasyonları listele |
| GET | `/api/operations/:id` | Operasyon detayı |
| POST | `/api/operations` | Operasyon oluştur |
| POST | `/api/operations/:id/start` | Operasyonu başlat |
| POST | `/api/operations/:id/pax` | Operasyona yolcu ekle |

**Operasyon Oluştur:**
```json
{
  "code": "OP-2024-001",
  "tour_name": "İzmir Şehir Turu",
  "date": "2024-01-15T00:00:00.000Z",
  "start_time": "2024-01-15T09:00:00.000Z",
  "vehicle_id": "35-VIP-01",
  "driver_id": "DRV-001",
  "guide_id": "GID-001",
  "total_pax": 20,
  "status": "planned",
  "route": [{"lat": 38.4255, "lng": 27.136}]
}
```

**Operasyona Yolcu Ekle:**
```json
{
  "name": "John Doe",
  "phone": "+90 555 123 4567",
  "pickup_point": {"lat": 38.4255, "lng": 27.136, "address": "Swissôtel"},
  "seat_no": "1A",
  "status": "waiting"
}
```

### Araçlar (GPS Heartbeat)

```bash
POST /api/vehicles/:id/heartbeat
{
  "lat": 38.4255,
  "lng": 27.136,
  "heading": 90,
  "speed": 45.5,
  "timestamp": "2024-01-15T09:15:30.000Z"
}
```

Backend bu veriyi MongoDB'ye kaydeder ve WebSocket üzerinden yayınlar.

### Yolcular (Check-in)

```bash
POST /api/pax/:id/checkin
{
  "method": "qr",
  "gps": {"lat": 38.4255, "lng": 27.136},
  "eventId": "unique-uuid"
}
```

**Not:** `eventId` idempotency için gereklidir. Aynı `eventId` ile tekrar gönderilirse işlem tekrarlanmaz.

### Diğer Endpoints

- `POST /api/locations` - Lokasyon oluştur
- `POST /api/customers` - Müşteri oluştur
- `POST /api/customers/:id/locations` - Müşteriye lokasyon ata
- `GET /api/notifications` - Bildirimleri listele

## WebSocket Events

**Bağlantı:**
```javascript
const socket = io('http://localhost:3001');
```

**Event'ler:**

| Event | Açıklama |
|-------|----------|
| `vehicle:{vehicleId}` | Araç konumu güncellemesi |
| `operation:{operationId}:vehicle_position` | Operasyona ait araç konumu |
| `operation:{operationId}` | Operasyon güncellemeleri (check-in, status değişikliği) |
| `alert` | Uyarılar ve bildirimler |

**Örnek:**
```javascript
socket.on('vehicle:35-VIP-01', (data) => {
  // { vehicle_id, position: {lat, lng, heading, speed}, timestamp }
});

socket.on('operation:507f1f77bcf86cd799439011', (data) => {
  // { type: 'pax_update', pax, checked_in_count }
});

socket.on('alert', (data) => {
  // { type: 'warning', message, related_id }
});
```

## Test


```bash
# 1. Login ve token al
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' | jq -r '.access_token')

# 2. Operasyonları listele
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/operations

# 3. GPS heartbeat gönder
curl -X POST http://localhost:3001/api/vehicles/35-VIP-01/heartbeat \
  -H "Content-Type: application/json" \
  -d '{"lat":38.4255,"lng":27.136,"heading":90,"speed":45.5}'
```

### Test Scriptleri

```bash
# Araç hareket simülasyonu (sürekli heartbeat gönderir)
npm run test:vehicle

# Bildirim testi (düşük check-in oranı uyarısı)
chmod +x test-notification.sh
./test-notification.sh
```

## Bildirim Sistemi

Otomatik uyarılar:
- **Düşük Check-in Oranı:** Operasyon başladıktan 15 dakika sonra, check-in oranı %70'in altındaysa
- **Check-in Olayları:** Her check-in işleminde bilgilendirme

Uyarılar WebSocket (`alert` event) ve REST API (`GET /api/notifications`) üzerinden erişilebilir.

## Notlar

- **Idempotency:** Check-in işlemleri `eventId` ile idempotent'tir
- **WebSocket:** Tüm gerçek zamanlı güncellemeler WebSocket üzerinden yayınlanır
- **Seed Script:** Mevcut verileri siler ve yeniden oluşturur (production'da dikkatli kullanın)

