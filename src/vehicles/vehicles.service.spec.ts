import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclesService],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return at least 10 initial vehicles', () => {
    const vehicles = service.findAll();
    expect(vehicles.length).toBeGreaterThanOrEqual(10);
  });

  it('should find vehicle by ID', () => {
    const vehicle = service.findOne('1');
    expect(vehicle).toBeDefined();
    expect(vehicle.id).toBe('1');
  });

  it('should throw NotFoundException for invalid ID', () => {
    expect(() => service.findOne('99999')).toThrow(NotFoundException);
  });

  it('should create a new vehicle', () => {
    const initialCount = service.findAll().length;
    const newVehicle = service.create({
      brand: 'Volvo',
      model: 'XC60',
      year: 2024,
      color: 'Cinza',
      price: 340000,
      licensePlate: 'VOL1A23',
    });

    expect(newVehicle).toBeDefined();
    expect(newVehicle.id).toBeDefined();
    expect(newVehicle.brand).toBe('Volvo');
    expect(service.findAll().length).toBe(initialCount + 1);

    // Clean up
    service.remove(newVehicle.id);
  });

  it('should update a vehicle', () => {
    const updated = service.update('1', { price: 150000 });
    expect(updated.price).toBe(150000);
  });
});
