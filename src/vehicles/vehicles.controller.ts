import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto): Vehicle {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  findAll(
    @Query('brand') brand?: string,
    @Query('search') search?: string,
  ): Vehicle[] {
    return this.vehiclesService.findAll(brand, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Vehicle {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Vehicle {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    return this.vehiclesService.remove(id);
  }
}
