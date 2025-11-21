import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LocationsService } from './locations/locations.service';
import { OperationsService } from './operations/operations.service';
import { PaxService } from './pax/pax.service';
import { AuthService } from './auth/auth.service';
import { CustomersService } from './customers/customers.service';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { OperationStatus } from './operations/types/operation.types';
import { PaxStatus } from './pax/types/pax.types';
import { AddLocationToCustomerDto } from './customers/dto/add-location.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const locationsService = app.get(LocationsService);
  const operationsService = app.get(OperationsService);
  const paxService = app.get(PaxService);
  const authService = app.get(AuthService);
  const customersService = app.get(CustomersService);
  const connection = app.get<Connection>(getConnectionToken());

  console.log('Clearing Database...');
  await connection.dropDatabase();
  console.log('Database cleared.');

  console.log('Seeding data...');

  try {
    await authService.register({
      username: 'admin',
      password: 'password',
      role: 'admin',
    });
    console.log('User admin seeded');
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.log('User admin already exists or error', errorMessage);
  }

  const locSwiss = await locationsService.create({
    name: 'Swissôtel Büyük Efes',
    address: 'Alsancak, Konak/İzmir',
    coordinates: { lat: 38.4255, lng: 27.136 },
  });

  const locMovenpick = await locationsService.create({
    name: 'Mövenpick Hotel Izmir',
    address: 'Kültür Konak/İzmir',
    coordinates: { lat: 38.424, lng: 27.1345 },
  });

  const locRenaissance = await locationsService.create({
    name: 'Renaissance Izmir Hotel',
    address: 'Akdeniz Konak/İzmir',
    coordinates: { lat: 38.423, lng: 27.138 },
  });

  const locHilton = await locationsService.create({
    name: 'Hilton Garden Inn İzmir Bayraklı',
    address: 'Çınarlı Bayraklı/İzmir',
    coordinates: { lat: 38.435, lng: 27.149 },
  });

  const locKarsiyaka = await locationsService.create({
    name: 'Best Western Premier Karşıyaka',
    address: 'Mavişehir Karşıyaka/İzmir',
    coordinates: { lat: 38.462, lng: 27.112 },
  });

  const locAirport = await locationsService.create({
    name: 'İzmir Adnan Menderes Havalimanı (ADB)',
    address: 'Gaziemir, İzmir',
    coordinates: { lat: 38.2922, lng: 27.1569 },
  });

  const locSaatKulesi = await locationsService.create({
    name: 'İzmir Saat Kulesi',
    address: 'Konak Meydanı, Konak/İzmir',
    coordinates: { lat: 38.4194, lng: 27.1287 },
  });

  const locKemeralti = await locationsService.create({
    name: 'Kemeraltı Çarşısı',
    address: 'Kemeraltı, Konak/İzmir',
    coordinates: { lat: 38.4208, lng: 27.1294 },
  });

  const locAsansor = await locationsService.create({
    name: 'Asansör',
    address: 'Dario Moreno Sk. No:148, Konak/İzmir',
    coordinates: { lat: 38.4178, lng: 27.1311 },
  });

  const locKordon = await locationsService.create({
    name: 'Kordon Boyu',
    address: 'Kordon, Alsancak/İzmir',
    coordinates: { lat: 38.4289, lng: 27.1333 },
  });

  const locArkeolojiMuzesi = await locationsService.create({
    name: 'İzmir Arkeoloji Müzesi',
    address: 'Bahriye Üçok Blv. No:4, Konak/İzmir',
    coordinates: { lat: 38.4142, lng: 27.1394 },
  });

  const locAgora = await locationsService.create({
    name: 'Agora Antik Kenti',
    address: 'Namazgah, Konak/İzmir',
    coordinates: { lat: 38.4211, lng: 27.1389 },
  });

  const locForumBornova = await locationsService.create({
    name: 'Forum Bornova AVM',
    address: 'Kazımdirik, Bornova/İzmir',
    coordinates: { lat: 38.4611, lng: 27.2111 },
  });

  const locCesme = await locationsService.create({
    name: 'Çeşme Marina',
    address: 'Çeşme, İzmir',
    coordinates: { lat: 38.3222, lng: 26.3056 },
  });

  const locEfes = await locationsService.create({
    name: 'Efes Antik Kenti',
    address: 'Selçuk, İzmir',
    coordinates: { lat: 37.9394, lng: 27.3411 },
  });

  const locBalikciRestaurant = await locationsService.create({
    name: 'Deniz Restaurant',
    address: 'Kordon, Alsancak/İzmir',
    coordinates: { lat: 38.4294, lng: 27.1344 },
  });

  const locKulturPark = await locationsService.create({
    name: 'Kültürpark',
    address: 'Kültürpark, Konak/İzmir',
    coordinates: { lat: 38.4256, lng: 27.1406 },
  });

  console.log('Locations seeded');

  const customer1 = await customersService.create({
    name: 'Ege VIP Travel',
    email: 'test@egeviptravel.com',
    phone: '+90 111 111 1111',
  });
  const customer2 = await customersService.create({
    name: 'Global Events & Tours',
    email: 'test@globalevents.com',
    phone: '+90 222 222 2222',
  });
  const customer3 = await customersService.create({
    name: 'Aegean Luxury Tours',
    email: 'info@aegeanluxury.com',
    phone: '+90 232 333 4444',
  });
  const customer4 = await customersService.create({
    name: 'İzmir Turizm Acentesi',
    email: 'rezervasyon@izmirturizm.com',
    phone: '+90 232 555 6666',
  });
  const customer5 = await customersService.create({
    name: 'Mediterranean Travel Services',
    email: 'contact@medtravel.com',
    phone: '+90 232 777 8888',
  });
  console.log('Customers seeded');

  const locSwissDoc = locSwiss as { _id?: unknown };
  const locMovenpickDoc = locMovenpick as { _id?: unknown };
  const locRenaissanceDoc = locRenaissance as { _id?: unknown };
  const locHiltonDoc = locHilton as { _id?: unknown };
  const locKarsiyakaDoc = locKarsiyaka as { _id?: unknown };
  const locAirportDoc = locAirport as { _id?: unknown };
  const locSaatKulesiDoc = locSaatKulesi as { _id?: unknown };
  const locKemeraltiDoc = locKemeralti as { _id?: unknown };
  const locKordonDoc = locKordon as { _id?: unknown };
  const locArkeolojiMuzesiDoc = locArkeolojiMuzesi as { _id?: unknown };
  const locAgoraDoc = locAgora as { _id?: unknown };
  const locForumBornovaDoc = locForumBornova as { _id?: unknown };
  const locCesmeDoc = locCesme as { _id?: unknown };
  const locEfesDoc = locEfes as { _id?: unknown };

  const customer1Doc = customer1 as { _id?: unknown };
  const customer2Doc = customer2 as { _id?: unknown };
  const customer3Doc = customer3 as { _id?: unknown };
  const customer4Doc = customer4 as { _id?: unknown };
  const customer5Doc = customer5 as { _id?: unknown };

  await customersService.addLocationToCustomer({
    id: String(customer1Doc._id),
    locationId: String(locSwissDoc._id),
  } as AddLocationToCustomerDto);
  await customersService.addLocationToCustomer({
    id: String(customer1Doc._id),
    locationId: String(locMovenpickDoc._id),
  } as AddLocationToCustomerDto);
  await customersService.addLocationToCustomer({
    id: String(customer1Doc._id),
    locationId: String(locAirportDoc._id),
  } as AddLocationToCustomerDto);

  await customersService.addLocationToCustomer({
    id: String(customer2Doc._id),
    locationId: String(locRenaissanceDoc._id),
  } as AddLocationToCustomerDto);
  await customersService.addLocationToCustomer({
    id: String(customer2Doc._id),
    locationId: String(locHiltonDoc._id),
  } as AddLocationToCustomerDto);
  await customersService.addLocationToCustomer({
    id: String(customer2Doc._id),
    locationId: String(locKarsiyakaDoc._id),
  } as AddLocationToCustomerDto);

  await customersService.addLocationToCustomer({
    id: String(customer3Doc._id),
    locationId: String(locSaatKulesiDoc._id),
  } as AddLocationToCustomerDto);
  await customersService.addLocationToCustomer({
    id: String(customer3Doc._id),
    locationId: String(locKordonDoc._id),
  } as AddLocationToCustomerDto);
  await customersService.addLocationToCustomer({
    id: String(customer3Doc._id),
    locationId: String(locArkeolojiMuzesiDoc._id),
  } as AddLocationToCustomerDto);

  await customersService.addLocationToCustomer({
    id: String(customer4Doc._id),
    locationId: String(locKemeraltiDoc._id),
  } as AddLocationToCustomerDto);
  await customersService.addLocationToCustomer({
    id: String(customer4Doc._id),
    locationId: String(locAgoraDoc._id),
  } as AddLocationToCustomerDto);
  await customersService.addLocationToCustomer({
    id: String(customer4Doc._id),
    locationId: String(locEfesDoc._id),
  } as AddLocationToCustomerDto);

  await customersService.addLocationToCustomer({
    id: String(customer5Doc._id),
    locationId: String(locCesmeDoc._id),
  } as AddLocationToCustomerDto);
  await customersService.addLocationToCustomer({
    id: String(customer5Doc._id),
    locationId: String(locForumBornovaDoc._id),
  } as AddLocationToCustomerDto);
  await customersService.addLocationToCustomer({
    id: String(customer5Doc._id),
    locationId: String(locAirportDoc._id),
  } as AddLocationToCustomerDto);

  console.log('Customers assigned to locations');

  const TwoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);

  const op1 = await operationsService.create({
    code: 'IZM-CITY-001',
    tour_name: 'İzmir Şehir Turu - Panoramik',
    status: OperationStatus.PLANNED,
    date: TwoHoursFromNow.toISOString(),
    start_time: TwoHoursFromNow.toISOString(),
    vehicle_id: '35-VIP-01',
    driver_id: 'DRV-Ahmet',
    guide_id: 'GID-Ayse',
    total_pax: 6,
    checked_in_count: 0,
    route: [
      locSwiss.coordinates,
      locMovenpick.coordinates,
      locRenaissance.coordinates,
      locKarsiyaka.coordinates,
    ],
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const op2 = await operationsService.create({
    code: 'TRF-OUT-002',
    tour_name: 'Otel -> Havalimanı Transferi',
    status: OperationStatus.PLANNED,
    date: tomorrow.toISOString(),
    start_time: tomorrow.toISOString(),
    vehicle_id: '35-VIP-02',
    driver_id: 'DRV-Mehmet',
    guide_id: 'GID-Can',
    total_pax: 4,
    checked_in_count: 0,
    route: [
      locHilton.coordinates,
      locSwiss.coordinates,
      locAirport.coordinates,
    ],
  });

  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  threeDaysLater.setHours(9, 0, 0, 0);

  const op3 = await operationsService.create({
    code: 'MUSEUM-003',
    tour_name: 'İzmir Müze ve Tarih Turu',
    status: OperationStatus.PLANNED,
    date: threeDaysLater.toISOString(),
    start_time: threeDaysLater.toISOString(),
    vehicle_id: '35-VIP-03',
    driver_id: 'DRV-Hasan',
    guide_id: 'GID-Fatma',
    total_pax: 8,
    checked_in_count: 0,
    route: [
      locRenaissance.coordinates,
      locArkeolojiMuzesi.coordinates,
      locAgora.coordinates,
      locSaatKulesi.coordinates,
      locKemeralti.coordinates,
    ],
  });

  const fourDaysLater = new Date();
  fourDaysLater.setDate(fourDaysLater.getDate() + 4);
  fourDaysLater.setHours(19, 0, 0, 0);

  const op4 = await operationsService.create({
    code: 'FOOD-004',
    tour_name: 'İzmir Lezzet Turu',
    status: OperationStatus.PLANNED,
    date: fourDaysLater.toISOString(),
    start_time: fourDaysLater.toISOString(),
    vehicle_id: '35-VIP-04',
    driver_id: 'DRV-Ali',
    guide_id: 'GID-Zeynep',
    total_pax: 6,
    checked_in_count: 0,
    route: [
      locHilton.coordinates,
      locKemeralti.coordinates,
      locBalikciRestaurant.coordinates,
      locKordon.coordinates,
    ],
  });

  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
  fiveDaysLater.setHours(8, 0, 0, 0);

  const op5 = await operationsService.create({
    code: 'EFES-005',
    tour_name: 'Efes Antik Kenti Turu',
    status: OperationStatus.PLANNED,
    date: fiveDaysLater.toISOString(),
    start_time: fiveDaysLater.toISOString(),
    vehicle_id: '35-VIP-05',
    driver_id: 'DRV-Murat',
    guide_id: 'GID-Elif',
    total_pax: 12,
    checked_in_count: 0,
    route: [
      locSwiss.coordinates,
      locMovenpick.coordinates,
      locEfes.coordinates,
    ],
  });

  const sixDaysLater = new Date();
  sixDaysLater.setDate(sixDaysLater.getDate() + 6);
  sixDaysLater.setHours(10, 0, 0, 0);

  const op6 = await operationsService.create({
    code: 'CESME-006',
    tour_name: 'Çeşme Yarımadası Turu',
    status: OperationStatus.PLANNED,
    date: sixDaysLater.toISOString(),
    start_time: sixDaysLater.toISOString(),
    vehicle_id: '35-VIP-06',
    driver_id: 'DRV-Emre',
    guide_id: 'GID-Selin',
    total_pax: 10,
    checked_in_count: 0,
    route: [
      locRenaissance.coordinates,
      locHilton.coordinates,
      locCesme.coordinates,
    ],
  });

  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  sevenDaysLater.setHours(14, 0, 0, 0);

  const op7 = await operationsService.create({
    code: 'SHOP-007',
    tour_name: 'Alışveriş ve Kültür Turu',
    status: OperationStatus.PLANNED,
    date: sevenDaysLater.toISOString(),
    start_time: sevenDaysLater.toISOString(),
    vehicle_id: '35-VIP-07',
    driver_id: 'DRV-Can',
    guide_id: 'GID-Merve',
    total_pax: 7,
    checked_in_count: 0,
    route: [
      locKarsiyaka.coordinates,
      locForumBornova.coordinates,
      locKemeralti.coordinates,
      locKulturPark.coordinates,
    ],
  });

  const eightDaysLater = new Date();
  eightDaysLater.setDate(eightDaysLater.getDate() + 8);
  eightDaysLater.setHours(20, 0, 0, 0);

  const op8 = await operationsService.create({
    code: 'NIGHT-008',
    tour_name: 'İzmir Gece Turu',
    status: OperationStatus.PLANNED,
    date: eightDaysLater.toISOString(),
    start_time: eightDaysLater.toISOString(),
    vehicle_id: '35-VIP-08',
    driver_id: 'DRV-Burak',
    guide_id: 'GID-Ayşe',
    total_pax: 5,
    checked_in_count: 0,
    route: [
      locSwiss.coordinates,
      locKordon.coordinates,
      locAsansor.coordinates,
      locSaatKulesi.coordinates,
    ],
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 10);
  nextWeek.setHours(6, 0, 0, 0);

  const op9 = await operationsService.create({
    code: 'TRF-IN-009',
    tour_name: 'Havalimanı -> Otel Transferi',
    status: OperationStatus.PLANNED,
    date: nextWeek.toISOString(),
    start_time: nextWeek.toISOString(),
    vehicle_id: '35-VIP-09',
    driver_id: 'DRV-Okan',
    guide_id: undefined,
    total_pax: 3,
    checked_in_count: 0,
    route: [
      locAirport.coordinates,
      locSwiss.coordinates,
      locMovenpick.coordinates,
      locRenaissance.coordinates,
    ],
  });

  const nextWeek2 = new Date();
  nextWeek2.setDate(nextWeek2.getDate() + 12);
  nextWeek2.setHours(11, 0, 0, 0);

  const op10 = await operationsService.create({
    code: 'CITY-010',
    tour_name: 'İzmir Panoramik Şehir Turu',
    status: OperationStatus.PLANNED,
    date: nextWeek2.toISOString(),
    start_time: nextWeek2.toISOString(),
    vehicle_id: '35-VIP-10',
    driver_id: 'DRV-Yusuf',
    guide_id: 'GID-Deniz',
    total_pax: 9,
    checked_in_count: 0,
    route: [
      locHilton.coordinates,
      locSaatKulesi.coordinates,
      locKordon.coordinates,
      locAsansor.coordinates,
      locKulturPark.coordinates,
      locKarsiyaka.coordinates,
    ],
  });

  console.log('Operations seeded');

  const op1Doc = op1 as { _id?: unknown };
  const op2Doc = op2 as { _id?: unknown };

  const pax1 = await paxService.create({
    name: 'Hakan Türkmen',
    phone: '+90 333 333 3333',
    status: PaxStatus.WAITING,
    operation_id: String(op1Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '1A',
    reservation_id: 'INT-101',
    notes: 'ön koltuk istiyor',
  });

  const pax2 = await paxService.create({
    name: 'Ali Yılmaz',
    phone: '+90 444 444 4444',
    status: PaxStatus.WAITING,
    operation_id: String(op1Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '1B',
    reservation_id: 'INT-101',
    notes: 'yan yana koltuk istiyor',
  });

  const pax3 = await paxService.create({
    name: 'Süleyman Kaya',
    phone: '+90 555 555 5555',
    status: PaxStatus.WAITING,
    operation_id: String(op1Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '2A',
    reservation_id: 'INT-102',
    notes: 'menüye bakınız',
  });

  const pax4 = await paxService.create({
    name: 'Emine Kaya',
    phone: '+90 666 666 6666',
    status: PaxStatus.WAITING,
    operation_id: String(op1Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '2B',
    reservation_id: 'INT-102',
  });

  const pax5 = await paxService.create({
    name: 'Kemal Kaya',
    phone: '+90 666 666 6666',
    status: PaxStatus.WAITING,
    operation_id: String(op1Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '3A',
    reservation_id: 'LOC-201',
    notes: 'Rehber ile görüşmek istemiyor',
  });

  const pax6 = await paxService.create({
    name: 'Nurcan Kaya',
    phone: '+90 777 777 7777',
    status: PaxStatus.WAITING,
    operation_id: String(op1Doc._id),
    pickup_point: {
      ...locKarsiyaka.coordinates,
      address: locKarsiyaka.address,
    },
    seat_no: '4A',
    reservation_id: 'LOC-202',
    notes: 'Tekne turuna katılmayacak',
  });

  const pax7 = await paxService.create({
    name: 'Dr. Martin Brown',
    phone: '+44 7700 900077',
    status: PaxStatus.WAITING,
    operation_id: String(op2Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '1A',
    reservation_id: 'CONF-301',
    notes: 'VIP Transfer',
  });

  const pax8 = await paxService.create({
    name: 'Sarah Connor',
    phone: '+1 202 555 0199',
    status: PaxStatus.WAITING,
    operation_id: String(op2Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '2A',
    reservation_id: 'CONF-302',
    notes: 'Bagajı fazla (3 valiz)',
  });

  const pax9 = await paxService.create({
    name: 'John Connor',
    phone: '+1 202 555 0198',
    status: PaxStatus.WAITING,
    operation_id: String(op2Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '2B',
    reservation_id: 'CONF-302',
  });

  const pax10 = await paxService.create({
    name: 'Mehmet Öz',
    phone: '+90 505 111 2233',
    status: PaxStatus.WAITING,
    operation_id: String(op2Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '3A',
    reservation_id: 'LOC-401',
    notes: 'Geç check-out yapacak',
  });

  const op3Doc = op3 as { _id?: unknown };
  const op4Doc = op4 as { _id?: unknown };
  const op5Doc = op5 as { _id?: unknown };
  const op6Doc = op6 as { _id?: unknown };
  const op7Doc = op7 as { _id?: unknown };
  const op8Doc = op8 as { _id?: unknown };
  const op9Doc = op9 as { _id?: unknown };
  const op10Doc = op10 as { _id?: unknown };

  // Müze turu için pax'lar
  const pax11 = await paxService.create({
    name: 'Prof. Dr. Ahmet Demir',
    phone: '+90 532 111 2233',
    status: PaxStatus.WAITING,
    operation_id: String(op3Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '1A',
    reservation_id: 'MUSE-501',
    notes: 'Tarih profesörü, detaylı bilgi ister',
  });

  const pax12 = await paxService.create({
    name: 'Maria Schmidt',
    phone: '+49 30 12345678',
    status: PaxStatus.WAITING,
    operation_id: String(op3Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '1B',
    reservation_id: 'MUSE-501',
  });

  const pax13 = await paxService.create({
    name: 'James Wilson',
    phone: '+1 212 555 1234',
    status: PaxStatus.WAITING,
    operation_id: String(op3Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '2A',
    reservation_id: 'MUSE-502',
    notes: 'Fotoğraf çekmek ister',
  });

  const pax14 = await paxService.create({
    name: 'Emma Wilson',
    phone: '+1 212 555 1235',
    status: PaxStatus.WAITING,
    operation_id: String(op3Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '2B',
    reservation_id: 'MUSE-502',
  });

  const pax15 = await paxService.create({
    name: 'Fatma Yıldız',
    phone: '+90 533 222 3344',
    status: PaxStatus.WAITING,
    operation_id: String(op3Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '3A',
    reservation_id: 'MUSE-503',
  });

  const pax16 = await paxService.create({
    name: 'Mustafa Yıldız',
    phone: '+90 533 222 3344',
    status: PaxStatus.WAITING,
    operation_id: String(op3Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '3B',
    reservation_id: 'MUSE-503',
  });

  const pax17 = await paxService.create({
    name: 'Sophie Martin',
    phone: '+33 1 42 34 56 78',
    status: PaxStatus.WAITING,
    operation_id: String(op3Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '4A',
    reservation_id: 'MUSE-504',
    notes: 'Fransızca rehber tercih eder',
  });

  const pax18 = await paxService.create({
    name: 'Pierre Martin',
    phone: '+33 1 42 34 56 79',
    status: PaxStatus.WAITING,
    operation_id: String(op3Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '4B',
    reservation_id: 'MUSE-504',
  });

  // Yemek turu için pax'lar
  const pax19 = await paxService.create({
    name: 'Chef Mehmet Arslan',
    phone: '+90 532 333 4455',
    status: PaxStatus.WAITING,
    operation_id: String(op4Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '1A',
    reservation_id: 'FOOD-601',
    notes: 'Profesyonel şef, yemek turu için',
  });

  const pax20 = await paxService.create({
    name: 'Lisa Anderson',
    phone: '+1 415 555 9876',
    status: PaxStatus.WAITING,
    operation_id: String(op4Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '1B',
    reservation_id: 'FOOD-601',
    notes: 'Vejetaryen menü',
  });

  const pax21 = await paxService.create({
    name: 'David Brown',
    phone: '+44 20 7946 0958',
    status: PaxStatus.WAITING,
    operation_id: String(op4Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '2A',
    reservation_id: 'FOOD-602',
  });

  const pax22 = await paxService.create({
    name: 'Jennifer Brown',
    phone: '+44 20 7946 0959',
    status: PaxStatus.WAITING,
    operation_id: String(op4Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '2B',
    reservation_id: 'FOOD-602',
    notes: 'Glutensiz diyet',
  });

  const pax23 = await paxService.create({
    name: 'Roberto Silva',
    phone: '+39 02 1234 5678',
    status: PaxStatus.WAITING,
    operation_id: String(op4Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '3A',
    reservation_id: 'FOOD-603',
  });

  const pax24 = await paxService.create({
    name: 'Giulia Silva',
    phone: '+39 02 1234 5679',
    status: PaxStatus.WAITING,
    operation_id: String(op4Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '3B',
    reservation_id: 'FOOD-603',
  });

  // Efes turu için pax'lar
  const pax25 = await paxService.create({
    name: 'Dr. Thomas Müller',
    phone: '+49 89 12345678',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '1A',
    reservation_id: 'EFES-701',
    notes: 'Arkeolog, detaylı tur istiyor',
  });

  const pax26 = await paxService.create({
    name: 'Anna Müller',
    phone: '+49 89 12345679',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '1B',
    reservation_id: 'EFES-701',
  });

  const pax27 = await paxService.create({
    name: 'Michael Chen',
    phone: '+86 10 1234 5678',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '2A',
    reservation_id: 'EFES-702',
  });

  const pax28 = await paxService.create({
    name: 'Wei Chen',
    phone: '+86 10 1234 5679',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '2B',
    reservation_id: 'EFES-702',
  });

  const pax29 = await paxService.create({
    name: 'Robert Taylor',
    phone: '+61 2 9374 4000',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '3A',
    reservation_id: 'EFES-703',
  });

  const pax30 = await paxService.create({
    name: 'Sarah Taylor',
    phone: '+61 2 9374 4001',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '3B',
    reservation_id: 'EFES-703',
  });

  const pax31 = await paxService.create({
    name: 'Carlos Rodriguez',
    phone: '+34 91 123 4567',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '4A',
    reservation_id: 'EFES-704',
  });

  const pax32 = await paxService.create({
    name: 'Elena Rodriguez',
    phone: '+34 91 123 4568',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '4B',
    reservation_id: 'EFES-704',
  });

  const pax33 = await paxService.create({
    name: 'Hans Weber',
    phone: '+41 44 123 4567',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locKarsiyaka.coordinates,
      address: locKarsiyaka.address,
    },
    seat_no: '5A',
    reservation_id: 'EFES-705',
  });

  const pax34 = await paxService.create({
    name: 'Claudia Weber',
    phone: '+41 44 123 4568',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locKarsiyaka.coordinates,
      address: locKarsiyaka.address,
    },
    seat_no: '5B',
    reservation_id: 'EFES-705',
  });

  const pax35 = await paxService.create({
    name: 'Yuki Tanaka',
    phone: '+81 3 1234 5678',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '6A',
    reservation_id: 'EFES-706',
    notes: 'Japonca rehber tercih eder',
  });

  const pax36 = await paxService.create({
    name: 'Hiroshi Tanaka',
    phone: '+81 3 1234 5679',
    status: PaxStatus.WAITING,
    operation_id: String(op5Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '6B',
    reservation_id: 'EFES-706',
  });

  // Çeşme turu için pax'lar
  const pax37 = await paxService.create({
    name: 'Amanda Johnson',
    phone: '+1 310 555 1234',
    status: PaxStatus.WAITING,
    operation_id: String(op6Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '1A',
    reservation_id: 'CESME-801',
  });

  const pax38 = await paxService.create({
    name: 'Mark Johnson',
    phone: '+1 310 555 1235',
    status: PaxStatus.WAITING,
    operation_id: String(op6Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '1B',
    reservation_id: 'CESME-801',
  });

  const pax39 = await paxService.create({
    name: 'Nina Petrov',
    phone: '+7 495 123 4567',
    status: PaxStatus.WAITING,
    operation_id: String(op6Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '2A',
    reservation_id: 'CESME-802',
  });

  const pax40 = await paxService.create({
    name: 'Ivan Petrov',
    phone: '+7 495 123 4568',
    status: PaxStatus.WAITING,
    operation_id: String(op6Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '2B',
    reservation_id: 'CESME-802',
  });

  const pax41 = await paxService.create({
    name: 'Ayşe Kaya',
    phone: '+90 532 444 5566',
    status: PaxStatus.WAITING,
    operation_id: String(op6Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '3A',
    reservation_id: 'CESME-803',
  });

  const pax42 = await paxService.create({
    name: 'Mehmet Kaya',
    phone: '+90 532 444 5566',
    status: PaxStatus.WAITING,
    operation_id: String(op6Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '3B',
    reservation_id: 'CESME-803',
  });

  const pax43 = await paxService.create({
    name: 'Zeynep Kaya',
    phone: '+90 532 444 5567',
    status: PaxStatus.WAITING,
    operation_id: String(op6Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '4A',
    reservation_id: 'CESME-803',
  });

  const pax44 = await paxService.create({
    name: 'Olivier Dubois',
    phone: '+33 1 45 67 89 01',
    status: PaxStatus.WAITING,
    operation_id: String(op6Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '5A',
    reservation_id: 'CESME-804',
  });

  const pax45 = await paxService.create({
    name: 'Marie Dubois',
    phone: '+33 1 45 67 89 02',
    status: PaxStatus.WAITING,
    operation_id: String(op6Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '5B',
    reservation_id: 'CESME-804',
  });

  const pax46 = await paxService.create({
    name: 'Lucas Dubois',
    phone: '+33 1 45 67 89 03',
    status: PaxStatus.WAITING,
    operation_id: String(op6Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '5C',
    reservation_id: 'CESME-804',
  });

  // Alışveriş turu için pax'lar
  const pax47 = await paxService.create({
    name: 'Linda Martinez',
    phone: '+1 305 555 2345',
    status: PaxStatus.WAITING,
    operation_id: String(op7Doc._id),
    pickup_point: {
      ...locKarsiyaka.coordinates,
      address: locKarsiyaka.address,
    },
    seat_no: '1A',
    reservation_id: 'SHOP-901',
  });

  const pax48 = await paxService.create({
    name: 'Patricia Martinez',
    phone: '+1 305 555 2346',
    status: PaxStatus.WAITING,
    operation_id: String(op7Doc._id),
    pickup_point: {
      ...locKarsiyaka.coordinates,
      address: locKarsiyaka.address,
    },
    seat_no: '1B',
    reservation_id: 'SHOP-901',
  });

  const pax49 = await paxService.create({
    name: 'Ahmet Çelik',
    phone: '+90 533 555 6677',
    status: PaxStatus.WAITING,
    operation_id: String(op7Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '2A',
    reservation_id: 'SHOP-902',
  });

  const pax50 = await paxService.create({
    name: 'Selin Çelik',
    phone: '+90 533 555 6677',
    status: PaxStatus.WAITING,
    operation_id: String(op7Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '2B',
    reservation_id: 'SHOP-902',
  });

  const pax51 = await paxService.create({
    name: 'Daniel Kim',
    phone: '+82 2 1234 5678',
    status: PaxStatus.WAITING,
    operation_id: String(op7Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '3A',
    reservation_id: 'SHOP-903',
  });

  const pax52 = await paxService.create({
    name: 'Min-ji Kim',
    phone: '+82 2 1234 5679',
    status: PaxStatus.WAITING,
    operation_id: String(op7Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '3B',
    reservation_id: 'SHOP-903',
  });

  const pax53 = await paxService.create({
    name: 'Francesco Rossi',
    phone: '+39 06 1234 5678',
    status: PaxStatus.WAITING,
    operation_id: String(op7Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '4A',
    reservation_id: 'SHOP-904',
  });

  // Gece turu için pax'lar
  const pax54 = await paxService.create({
    name: "Kevin O'Brien",
    phone: '+353 1 234 5678',
    status: PaxStatus.WAITING,
    operation_id: String(op8Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '1A',
    reservation_id: 'NIGHT-1001',
  });

  const pax55 = await paxService.create({
    name: "Sophie O'Brien",
    phone: '+353 1 234 5679',
    status: PaxStatus.WAITING,
    operation_id: String(op8Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '1B',
    reservation_id: 'NIGHT-1001',
  });

  const pax56 = await paxService.create({
    name: 'Andreas Schmidt',
    phone: '+49 40 12345678',
    status: PaxStatus.WAITING,
    operation_id: String(op8Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '2A',
    reservation_id: 'NIGHT-1002',
  });

  const pax57 = await paxService.create({
    name: 'Julia Schmidt',
    phone: '+49 40 12345679',
    status: PaxStatus.WAITING,
    operation_id: String(op8Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '2B',
    reservation_id: 'NIGHT-1002',
  });

  const pax58 = await paxService.create({
    name: 'Erik Johansson',
    phone: '+46 8 123 456 78',
    status: PaxStatus.WAITING,
    operation_id: String(op8Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '3A',
    reservation_id: 'NIGHT-1003',
  });

  // Transfer için pax'lar
  const pax59 = await paxService.create({
    name: 'Dr. Peter Anderson',
    phone: '+1 617 555 3456',
    status: PaxStatus.WAITING,
    operation_id: String(op9Doc._id),
    pickup_point: {
      ...locAirport.coordinates,
      address: locAirport.address,
    },
    seat_no: '1A',
    reservation_id: 'TRF-1101',
    notes: 'VIP Transfer, erken varış',
  });

  const pax60 = await paxService.create({
    name: 'Catherine Anderson',
    phone: '+1 617 555 3457',
    status: PaxStatus.WAITING,
    operation_id: String(op9Doc._id),
    pickup_point: {
      ...locAirport.coordinates,
      address: locAirport.address,
    },
    seat_no: '1B',
    reservation_id: 'TRF-1101',
  });

  const pax61 = await paxService.create({
    name: 'Mohammed Al-Rashid',
    phone: '+971 4 123 4567',
    status: PaxStatus.WAITING,
    operation_id: String(op9Doc._id),
    pickup_point: {
      ...locAirport.coordinates,
      address: locAirport.address,
    },
    seat_no: '2A',
    reservation_id: 'TRF-1102',
    notes: 'Halal yemek tercih eder',
  });

  // Şehir turu için pax'lar
  const pax62 = await paxService.create({
    name: 'Isabella Garcia',
    phone: '+34 93 123 4567',
    status: PaxStatus.WAITING,
    operation_id: String(op10Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '1A',
    reservation_id: 'CITY-1201',
  });

  const pax63 = await paxService.create({
    name: 'Miguel Garcia',
    phone: '+34 93 123 4568',
    status: PaxStatus.WAITING,
    operation_id: String(op10Doc._id),
    pickup_point: {
      ...locHilton.coordinates,
      address: locHilton.address,
    },
    seat_no: '1B',
    reservation_id: 'CITY-1201',
  });

  const pax64 = await paxService.create({
    name: 'Tomoko Yamada',
    phone: '+81 6 1234 5678',
    status: PaxStatus.WAITING,
    operation_id: String(op10Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '2A',
    reservation_id: 'CITY-1202',
  });

  const pax65 = await paxService.create({
    name: 'Kenji Yamada',
    phone: '+81 6 1234 5679',
    status: PaxStatus.WAITING,
    operation_id: String(op10Doc._id),
    pickup_point: {
      ...locSwiss.coordinates,
      address: locSwiss.address,
    },
    seat_no: '2B',
    reservation_id: 'CITY-1202',
  });

  const pax66 = await paxService.create({
    name: 'Rachel Green',
    phone: '+1 646 555 4567',
    status: PaxStatus.WAITING,
    operation_id: String(op10Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '3A',
    reservation_id: 'CITY-1203',
  });

  const pax67 = await paxService.create({
    name: 'Monica Green',
    phone: '+1 646 555 4568',
    status: PaxStatus.WAITING,
    operation_id: String(op10Doc._id),
    pickup_point: {
      ...locMovenpick.coordinates,
      address: locMovenpick.address,
    },
    seat_no: '3B',
    reservation_id: 'CITY-1203',
  });

  const pax68 = await paxService.create({
    name: 'Serkan Yılmaz',
    phone: '+90 532 666 7788',
    status: PaxStatus.WAITING,
    operation_id: String(op10Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '4A',
    reservation_id: 'CITY-1204',
  });

  const pax69 = await paxService.create({
    name: 'Burcu Yılmaz',
    phone: '+90 532 666 7788',
    status: PaxStatus.WAITING,
    operation_id: String(op10Doc._id),
    pickup_point: {
      ...locRenaissance.coordinates,
      address: locRenaissance.address,
    },
    seat_no: '4B',
    reservation_id: 'CITY-1204',
  });

  const pax70 = await paxService.create({
    name: 'Alexander Petrov',
    phone: '+7 812 123 4567',
    status: PaxStatus.WAITING,
    operation_id: String(op10Doc._id),
    pickup_point: {
      ...locKarsiyaka.coordinates,
      address: locKarsiyaka.address,
    },
    seat_no: '5A',
    reservation_id: 'CITY-1205',
  });

  console.log('Pax seeded');

  const pax1Doc = pax1 as { _id?: unknown };
  const pax2Doc = pax2 as { _id?: unknown };
  const pax3Doc = pax3 as { _id?: unknown };
  const pax4Doc = pax4 as { _id?: unknown };
  const pax5Doc = pax5 as { _id?: unknown };
  const pax6Doc = pax6 as { _id?: unknown };
  const pax7Doc = pax7 as { _id?: unknown };
  const pax8Doc = pax8 as { _id?: unknown };
  const pax9Doc = pax9 as { _id?: unknown };
  const pax10Doc = pax10 as { _id?: unknown };
  const pax11Doc = pax11 as { _id?: unknown };
  const pax12Doc = pax12 as { _id?: unknown };
  const pax13Doc = pax13 as { _id?: unknown };
  const pax14Doc = pax14 as { _id?: unknown };
  const pax15Doc = pax15 as { _id?: unknown };
  const pax16Doc = pax16 as { _id?: unknown };
  const pax17Doc = pax17 as { _id?: unknown };
  const pax18Doc = pax18 as { _id?: unknown };
  const pax19Doc = pax19 as { _id?: unknown };
  const pax20Doc = pax20 as { _id?: unknown };
  const pax21Doc = pax21 as { _id?: unknown };
  const pax22Doc = pax22 as { _id?: unknown };
  const pax23Doc = pax23 as { _id?: unknown };
  const pax24Doc = pax24 as { _id?: unknown };
  const pax25Doc = pax25 as { _id?: unknown };
  const pax26Doc = pax26 as { _id?: unknown };
  const pax27Doc = pax27 as { _id?: unknown };
  const pax28Doc = pax28 as { _id?: unknown };
  const pax29Doc = pax29 as { _id?: unknown };
  const pax30Doc = pax30 as { _id?: unknown };
  const pax31Doc = pax31 as { _id?: unknown };
  const pax32Doc = pax32 as { _id?: unknown };
  const pax33Doc = pax33 as { _id?: unknown };
  const pax34Doc = pax34 as { _id?: unknown };
  const pax35Doc = pax35 as { _id?: unknown };
  const pax36Doc = pax36 as { _id?: unknown };
  const pax37Doc = pax37 as { _id?: unknown };
  const pax38Doc = pax38 as { _id?: unknown };
  const pax39Doc = pax39 as { _id?: unknown };
  const pax40Doc = pax40 as { _id?: unknown };
  const pax41Doc = pax41 as { _id?: unknown };
  const pax42Doc = pax42 as { _id?: unknown };
  const pax43Doc = pax43 as { _id?: unknown };
  const pax44Doc = pax44 as { _id?: unknown };
  const pax45Doc = pax45 as { _id?: unknown };
  const pax46Doc = pax46 as { _id?: unknown };
  const pax47Doc = pax47 as { _id?: unknown };
  const pax48Doc = pax48 as { _id?: unknown };
  const pax49Doc = pax49 as { _id?: unknown };
  const pax50Doc = pax50 as { _id?: unknown };
  const pax51Doc = pax51 as { _id?: unknown };
  const pax52Doc = pax52 as { _id?: unknown };
  const pax53Doc = pax53 as { _id?: unknown };
  const pax54Doc = pax54 as { _id?: unknown };
  const pax55Doc = pax55 as { _id?: unknown };
  const pax56Doc = pax56 as { _id?: unknown };
  const pax57Doc = pax57 as { _id?: unknown };
  const pax58Doc = pax58 as { _id?: unknown };
  const pax59Doc = pax59 as { _id?: unknown };
  const pax60Doc = pax60 as { _id?: unknown };
  const pax61Doc = pax61 as { _id?: unknown };
  const pax62Doc = pax62 as { _id?: unknown };
  const pax63Doc = pax63 as { _id?: unknown };
  const pax64Doc = pax64 as { _id?: unknown };
  const pax65Doc = pax65 as { _id?: unknown };
  const pax66Doc = pax66 as { _id?: unknown };
  const pax67Doc = pax67 as { _id?: unknown };
  const pax68Doc = pax68 as { _id?: unknown };
  const pax69Doc = pax69 as { _id?: unknown };
  const pax70Doc = pax70 as { _id?: unknown };

  const op1Updated = await operationsService.findOne(String(op1Doc._id));
  if (op1Updated) {
    op1Updated.pax = [
      String(pax1Doc._id),
      String(pax2Doc._id),
      String(pax3Doc._id),
      String(pax4Doc._id),
      String(pax5Doc._id),
      String(pax6Doc._id),
    ] as unknown as string[];
    await (op1Updated as { save: () => Promise<unknown> }).save();
  }

  const op2Updated = await operationsService.findOne(String(op2Doc._id));
  if (op2Updated) {
    op2Updated.pax = [
      String(pax7Doc._id),
      String(pax8Doc._id),
      String(pax9Doc._id),
      String(pax10Doc._id),
    ] as unknown as string[];
    await (op2Updated as { save: () => Promise<unknown> }).save();
  }

  const op3Updated = await operationsService.findOne(String(op3Doc._id));
  if (op3Updated) {
    op3Updated.pax = [
      String(pax11Doc._id),
      String(pax12Doc._id),
      String(pax13Doc._id),
      String(pax14Doc._id),
      String(pax15Doc._id),
      String(pax16Doc._id),
      String(pax17Doc._id),
      String(pax18Doc._id),
    ] as unknown as string[];
    await (op3Updated as { save: () => Promise<unknown> }).save();
  }

  const op4Updated = await operationsService.findOne(String(op4Doc._id));
  if (op4Updated) {
    op4Updated.pax = [
      String(pax19Doc._id),
      String(pax20Doc._id),
      String(pax21Doc._id),
      String(pax22Doc._id),
      String(pax23Doc._id),
      String(pax24Doc._id),
    ] as unknown as string[];
    await (op4Updated as { save: () => Promise<unknown> }).save();
  }

  const op5Updated = await operationsService.findOne(String(op5Doc._id));
  if (op5Updated) {
    op5Updated.pax = [
      String(pax25Doc._id),
      String(pax26Doc._id),
      String(pax27Doc._id),
      String(pax28Doc._id),
      String(pax29Doc._id),
      String(pax30Doc._id),
      String(pax31Doc._id),
      String(pax32Doc._id),
      String(pax33Doc._id),
      String(pax34Doc._id),
      String(pax35Doc._id),
      String(pax36Doc._id),
    ] as unknown as string[];
    await (op5Updated as { save: () => Promise<unknown> }).save();
  }

  const op6Updated = await operationsService.findOne(String(op6Doc._id));
  if (op6Updated) {
    op6Updated.pax = [
      String(pax37Doc._id),
      String(pax38Doc._id),
      String(pax39Doc._id),
      String(pax40Doc._id),
      String(pax41Doc._id),
      String(pax42Doc._id),
      String(pax43Doc._id),
      String(pax44Doc._id),
      String(pax45Doc._id),
      String(pax46Doc._id),
    ] as unknown as string[];
    await (op6Updated as { save: () => Promise<unknown> }).save();
  }

  const op7Updated = await operationsService.findOne(String(op7Doc._id));
  if (op7Updated) {
    op7Updated.pax = [
      String(pax47Doc._id),
      String(pax48Doc._id),
      String(pax49Doc._id),
      String(pax50Doc._id),
      String(pax51Doc._id),
      String(pax52Doc._id),
      String(pax53Doc._id),
    ] as unknown as string[];
    await (op7Updated as { save: () => Promise<unknown> }).save();
  }

  const op8Updated = await operationsService.findOne(String(op8Doc._id));
  if (op8Updated) {
    op8Updated.pax = [
      String(pax54Doc._id),
      String(pax55Doc._id),
      String(pax56Doc._id),
      String(pax57Doc._id),
      String(pax58Doc._id),
    ] as unknown as string[];
    await (op8Updated as { save: () => Promise<unknown> }).save();
  }

  const op9Updated = await operationsService.findOne(String(op9Doc._id));
  if (op9Updated) {
    op9Updated.pax = [
      String(pax59Doc._id),
      String(pax60Doc._id),
      String(pax61Doc._id),
    ] as unknown as string[];
    await (op9Updated as { save: () => Promise<unknown> }).save();
  }

  const op10Updated = await operationsService.findOne(String(op10Doc._id));
  if (op10Updated) {
    op10Updated.pax = [
      String(pax62Doc._id),
      String(pax63Doc._id),
      String(pax64Doc._id),
      String(pax65Doc._id),
      String(pax66Doc._id),
      String(pax67Doc._id),
      String(pax68Doc._id),
      String(pax69Doc._id),
      String(pax70Doc._id),
    ] as unknown as string[];
    await (op10Updated as { save: () => Promise<unknown> }).save();
  }

  console.log('Operations updated with Pax IDs');

  await app.close();
}

void bootstrap();
