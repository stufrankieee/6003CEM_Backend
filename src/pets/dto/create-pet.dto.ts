import { ApiProperty } from "@nestjs/swagger";

export class CreatePetDto {
    @ApiProperty()
    petName: string;

    @ApiProperty()
    dateOfBirth: Date;
    
    @ApiProperty()
    breed: string;

    @ApiProperty()
    microchipNo: number;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    intake: string;

    @ApiProperty()
    remark: string;

    @ApiProperty()
    introduction: string;
}
