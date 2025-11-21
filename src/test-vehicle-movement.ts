import * as http from 'http';

interface Operation {
  _id: string;
  code: string;
  tour_name: string;
  vehicle_id: string;
  route: { lat: number; lng: number }[];
  status: string;
}

interface HeartbeatData {
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  timestamp: string;
}

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001/api';
const HEARTBEAT_INTERVAL = 1000; // 3 saniye

// Renk kodları
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

// HTTP isteği yap
async function httpRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<{ statusCode: number; body: unknown }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options: http.RequestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed: unknown = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode || 200, body: parsed });
        } catch {
          resolve({ statusCode: res.statusCode || 200, body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Aktif operasyonları çek
async function fetchActiveOperations(): Promise<Operation[]> {
  try {
    const url = `${API_BASE_URL}/operations?status=active`;
    const response = await httpRequest('GET', url);

    if (response.statusCode !== 200) {
      throw new Error(`HTTP ${response.statusCode}`);
    }

    const operations = Array.isArray(response.body) ? response.body : [];
    return operations.filter((op): op is Operation => {
      return (
        typeof op === 'object' &&
        op !== null &&
        'vehicle_id' in op &&
        typeof (op as Operation).vehicle_id === 'string' &&
        (op as Operation).vehicle_id.trim() !== ''
      );
    });
  } catch (error) {
    console.error(
      `${colors.red}❌ Failed to fetch operations:${colors.reset}`,
      error,
    );
    return [];
  }
}

// İki nokta arası mesafe hesapla (Haversine formülü - metre)
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000; // Dünya yarıçapı (metre)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// İki nokta arası heading hesapla (derece)
function calculateHeading(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

  let heading = (Math.atan2(y, x) * 180) / Math.PI;
  heading = (heading + 360) % 360;
  return Math.round(heading);
}

// Heartbeat gönder
async function sendHeartbeat(
  vehicleId: string,
  data: HeartbeatData,
): Promise<boolean> {
  try {
    const url = `${API_BASE_URL}/vehicles/${vehicleId}/heartbeat`;
    const response = await httpRequest('POST', url, data);

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log(
        `${colors.green}✅${colors.reset} [${vehicleId}] Lat=${data.lat.toFixed(6)}, Lng=${data.lng.toFixed(6)}, Heading=${data.heading}°, Speed=${data.speed}km/h`,
      );
      return true;
    } else {
      console.log(
        `${colors.yellow}⚠️${colors.reset}  [${vehicleId}] HTTP ${response.statusCode} - Failed to send heartbeat`,
      );
      return false;
    }
  } catch (error) {
    console.log(
      `${colors.yellow}⚠️${colors.reset}  [${vehicleId}] Error: ${error}`,
    );
    return false;
  }
}

// Tek bir araç için simülasyon
async function simulateVehicle(operation: Operation, color: string) {
  const vehicleId = operation.vehicle_id;
  console.log(
    `${color}🚗 Starting simulation for vehicle: ${vehicleId}${colors.reset}`,
  );

  // Route'u al
  let route = operation.route || [];
  if (route.length === 0) {
    console.log(
      `${colors.yellow}⚠️${colors.reset}  No route found for ${vehicleId}, using default coordinates`,
    );
    route = [
      { lat: 38.4255, lng: 27.136 },
      { lat: 38.424, lng: 27.1345 },
      { lat: 38.423, lng: 27.138 },
    ];
  }

  // Başlangıç koordinatları
  let lat = route[0].lat;
  let lng = route[0].lng;
  let routeIndex = 0;
  let targetLat = route.length > 1 ? route[1].lat : lat;
  let targetLng = route.length > 1 ? route[1].lng : lng;
  let heading =
    route.length > 1 ? calculateHeading(lat, lng, targetLat, targetLng) : 90;
  let speed = 50;

  if (route.length > 1) {
    routeIndex = 1;
  }

  // Ana döngü
  while (true) {
    // Hedefe mesafe hesapla
    const distance = calculateDistance(lat, lng, targetLat, targetLng);

    // Hedefe ulaştıysak (50m içindeyse) sonraki noktaya geç
    if (distance < 50) {
      routeIndex = (routeIndex + 1) % route.length;
      targetLat = route[routeIndex].lat;
      targetLng = route[routeIndex].lng;
      heading = calculateHeading(lat, lng, targetLat, targetLng);
    }

    // Hedefe doğru hareket et
    const stepSize = 0.0003; // Yaklaşık 30 metre
    const headingRad = (heading * Math.PI) / 180;

    // Heading'e göre hareket
    lat += stepSize * Math.cos(headingRad);
    lng += stepSize * Math.sin(headingRad);

    // Hızı rastgele değiştir (40-70 km/h arası)
    speed = 40 + Math.floor(Math.random() * 31);

    // Koordinat validasyonu (İzmir bölgesi)
    if (lat < 35 || lat > 42 || lng < 25 || lng > 30) {
      console.log(
        `${colors.red}❌ Invalid coordinates for ${vehicleId}, resetting${colors.reset}`,
      );
      lat = route[0].lat;
      lng = route[0].lng;
      routeIndex = 0;
      continue;
    }

    // Heartbeat gönder
    const timestamp = new Date().toISOString();
    await sendHeartbeat(vehicleId, {
      lat,
      lng,
      heading,
      speed,
      timestamp,
    });

    // Interval bekle
    await new Promise((resolve) => setTimeout(resolve, HEARTBEAT_INTERVAL));
  }
}

// Ana program
async function main() {
  console.log(`${colors.blue}🚗 Karanix Vehicle Movement Test${colors.reset}`);
  console.log(`${colors.blue}=================================${colors.reset}`);
  console.log(`API URL: ${API_BASE_URL}`);
  console.log(`Heartbeat Interval: ${HEARTBEAT_INTERVAL / 1000} seconds\n`);

  // Ctrl+C yakalama
  process.on('SIGINT', () => {
    console.log(
      `\n${colors.yellow}🛑 Stopping all vehicle simulations...${colors.reset}`,
    );
    process.exit(0);
  });

  while (true) {
    // Aktif operasyonları çek
    console.log(
      `${colors.cyan}📡 Fetching active operations...${colors.reset}`,
    );
    const operations = await fetchActiveOperations();

    if (operations.length === 0) {
      console.log(
        `${colors.yellow}⚠️  No active operations found.${colors.reset}`,
      );
      console.log(
        `${colors.cyan}💡 Tip: Start an operation first using POST /api/operations/:id/start${colors.reset}`,
      );
      console.log(`Waiting 10 seconds before retry...\n`);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      continue;
    }

    console.log(
      `${colors.green}✅ Found ${operations.length} active vehicle(s):${colors.reset}`,
    );
    for (const op of operations) {
      console.log(`   - ${colors.cyan}${op.vehicle_id}${colors.reset}`);
    }
    console.log(
      `\n${colors.yellow}Press Ctrl+C to stop all simulations${colors.reset}\n`,
    );

    // Her araç için simülasyon başlat (background'da çalışacak)
    const vehicleColors = [
      colors.green,
      colors.blue,
      colors.cyan,
      colors.yellow,
      colors.red,
    ];

    operations.forEach((op, index) => {
      const color = vehicleColors[index % vehicleColors.length];
      // Her simülasyonu ayrı bir promise olarak başlat (await etmeden)
      simulateVehicle(op, color).catch((error) => {
        console.error(
          `${colors.red}❌ Error in simulation for ${op.vehicle_id}:${colors.reset}`,
          error,
        );
      });
    });

    // Simülasyonlar başladı, sonsuz döngüde bekle
    await new Promise(() => {}); // Asla resolve olmayacak
  }
}

// Programı başlat
main().catch((error) => {
  console.error(`${colors.red}❌ Fatal error:${colors.reset}`, error);
  process.exit(1);
});
