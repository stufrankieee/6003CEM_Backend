import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository
    (Pet) private petsRepository: Repository<Pet>,
  ) {}
  async create(createPetDto: CreatePetDto) {
    return this.petsRepository.save(createPetDto);
  }

  async update(updatePetDto: UpdatePetDto) {
    const pet: Pet = {
      id: updatePetDto.id,
      petName: updatePetDto.petName,
      dateOfBirth: updatePetDto.dateOfBirth,
      breed: updatePetDto.breed,
      microchipNo: updatePetDto.microchipNo,
      gender: updatePetDto.gender,
      intake: updatePetDto.intake,
      remark: updatePetDto.remark,
      introduction: updatePetDto.introduction,
    };

    return await this.petsRepository.save(pet);
  }

  async remove(id: number) {
    return await this.petsRepository.delete(+id);
  }

  findAll(petName: string, breed: string) {
    const where: any = {};
    if (petName) {
      where.petName = Like(`%${petName}%`);
    }

    if (breed) {
      where.breed = Like(`%${breed}%`);
    }

    return this.petsRepository.find({
      where
    });
  }

  findOne(id: number) {
    return this.petsRepository.findOne({
      where: {
        id
      }
    });
  }
}
