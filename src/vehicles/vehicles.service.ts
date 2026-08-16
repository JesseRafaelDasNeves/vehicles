import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService implements OnModuleInit {
  private readonly filePath = path.resolve(
    process.cwd(),
    'src/data/vehicles.json',
  );
  private vehicles: Vehicle[] = [];

  onModuleInit() {
    this.loadVehicles();
  }

  private loadVehicles(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileData = fs.readFileSync(this.filePath, 'utf-8');
        this.vehicles = JSON.parse(fileData) as Vehicle[];
      } else {
        // Garantir que o diretório exista se o arquivo não existir
        const dirPath = path.dirname(this.filePath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        this.vehicles = this.getDefaultVehicles();
        this.saveToFile();
      }
    } catch (error) {
      console.error('Erro ao carregar o arquivo de mock de veículos:', error);
      this.vehicles = this.getDefaultVehicles();
    }
  }

  private saveToFile(): void {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.vehicles, null, 2),
        'utf-8',
      );
    } catch (error) {
      console.error('Erro ao salvar no arquivo de mock de veículos:', error);
    }
  }

  private getDefaultVehicles(): Vehicle[] {
    const now = new Date().toISOString();
    return [
      {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla XEi',
        year: 2023,
        color: 'Preto',
        price: 145000,
        licensePlate: 'BRA2E19',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '2',
        brand: 'Honda',
        model: 'Civic Touring',
        year: 2022,
        color: 'Prata',
        price: 138000,
        licensePlate: 'ABC1D23',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '3',
        brand: 'Volkswagen',
        model: 'Golf GTI',
        year: 2021,
        color: 'Vermelho',
        price: 185000,
        licensePlate: 'GOL4F56',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '4',
        brand: 'Ford',
        model: 'Mustang GT 5.0',
        year: 2020,
        color: 'Azul',
        price: 320000,
        licensePlate: 'MUS7G89',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '5',
        brand: 'Chevrolet',
        model: 'Onix Premier',
        year: 2024,
        color: 'Branco',
        price: 92000,
        licensePlate: 'ONI0H12',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '6',
        brand: 'BMW',
        model: '320i M Sport',
        year: 2023,
        color: 'Cinza',
        price: 290000,
        licensePlate: 'BMW3I45',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '7',
        brand: 'Hyundai',
        model: 'HB20 Evolution',
        year: 2022,
        color: 'Preto',
        price: 78000,
        licensePlate: 'HB20J67',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '8',
        brand: 'Nissan',
        model: 'Kicks Exclusive',
        year: 2023,
        color: 'Vermelho',
        price: 115000,
        licensePlate: 'KIC8K90',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '9',
        brand: 'Jeep',
        model: 'Renegade Longitude',
        year: 2022,
        color: 'Verde',
        price: 125000,
        licensePlate: 'JEP5L12',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '10',
        brand: 'Jeep',
        model: 'Compass Limited',
        year: 2024,
        color: 'Prata',
        price: 195000,
        licensePlate: 'COM9M34',
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  findAll(brand?: string, search?: string): Vehicle[] {
    let result = [...this.vehicles];

    if (brand) {
      result = result.filter(
        (v) => v.brand.toLowerCase() === brand.toLowerCase(),
      );
    }

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.brand.toLowerCase().includes(term) ||
          v.model.toLowerCase().includes(term) ||
          v.color.toLowerCase().includes(term) ||
          v.licensePlate.toLowerCase().includes(term),
      );
    }

    return result;
  }

  findOne(id: string): Vehicle {
    const vehicle = this.vehicles.find((v) => v.id === id);
    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID "${id}" não foi encontrado.`);
    }
    return vehicle;
  }

  create(createVehicleDto: CreateVehicleDto): Vehicle {
    const nextId = (
      this.vehicles.reduce(
        (max, v) => (parseInt(v.id, 10) > max ? parseInt(v.id, 10) : max),
        0,
      ) + 1
    ).toString();

    const now = new Date().toISOString();

    const newVehicle: Vehicle = {
      id: nextId,
      ...createVehicleDto,
      createdAt: now,
      updatedAt: now,
    };

    this.vehicles.push(newVehicle);
    this.saveToFile();
    return newVehicle;
  }

  update(id: string, updateVehicleDto: UpdateVehicleDto): Vehicle {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new NotFoundException(`Veículo com ID "${id}" não foi encontrado.`);
    }

    const current = this.vehicles[index];
    const updatedVehicle: Vehicle = {
      ...current,
      ...updateVehicleDto,
      updatedAt: new Date().toISOString(),
    };

    this.vehicles[index] = updatedVehicle;
    this.saveToFile();
    return updatedVehicle;
  }

  remove(id: string): { message: string } {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new NotFoundException(`Veículo com ID "${id}" não foi encontrado.`);
    }

    this.vehicles.splice(index, 1);
    this.saveToFile();
    return { message: `Veículo com ID "${id}" foi removido com sucesso.` };
  }
}
