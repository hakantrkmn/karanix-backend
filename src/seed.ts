import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LocationsService } from './locations/locations.service';
import { OperationsService } from './operations/operations.service';
import { PaxService } from './pax/pax.service';
import { VehiclesService } from './vehicles/vehicles.service';
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
  const vehiclesService = app.get(VehiclesService);
  const authService = app.get(AuthService);
  const customersService = app.get(CustomersService);
  const connection = app.get<Connection>(getConnectionToken());

  console.log('Clearing Database...');
  await connection.dropDatabase();
  console.log('Database cleared.');

  console.log('Seeding data...');

  // User
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

  console.log('Locations seeded');

  // Customers
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
  console.log('Customers seeded');

  // Assign customers to locations
  const locSwissDoc = locSwiss as { _id?: unknown };
  const locMovenpickDoc = locMovenpick as { _id?: unknown };
  const locRenaissanceDoc = locRenaissance as { _id?: unknown };
  const locHiltonDoc = locHilton as { _id?: unknown };
  const locKarsiyakaDoc = locKarsiyaka as { _id?: unknown };
  const locAirportDoc = locAirport as { _id?: unknown };

  const customer1Doc = customer1 as { _id?: unknown };
  const customer2Doc = customer2 as { _id?: unknown };

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

  console.log('Customers assigned to locations');

  // Operations

  // OP-001: Active, İzmir City Tour.
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

  // OP-002: Planned, Tomorrow Outbound Transfer (Oteller -> Havalimanı)
  // Route: Hilton -> Swiss -> Airport
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
  console.log('Operations seeded');

  // Pax
  const op1Doc = op1 as { _id?: unknown };
  const op2Doc = op2 as { _id?: unknown };

  // Operation 1 Pax (6 pax) - Dağınık Oteller
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

  // Operation 2 Pax (4 pax) - Otellerden Havalimanına
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

  console.log('Pax seeded');

  // Update Operations with Pax IDs
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
  console.log('Operations updated with Pax IDs');

  await vehiclesService.createHeartbeat('35-VIP-01', {
    lat: 38.426,
    lng: 27.1365,
    heading: 180,
    speed: 30,
    timestamp: new Date().toISOString(),
  });

  await vehiclesService.createHeartbeat('35-VIP-02', {
    lat: 38.4192,
    lng: 27.1287,
    heading: 0,
    speed: 0,
    timestamp: new Date().toISOString(),
  });
  console.log('Vehicle heartbeats seeded');

  await app.close();
}

void bootstrap();
