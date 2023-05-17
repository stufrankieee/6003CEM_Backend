import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    petName: string;

    @Column()
    dateOfBirth: Date;

    @Column()
    breed: string;

    @Column()
    microchipNo: number;

    @Column()
    gender: string;

    @Column()
    intake: string;

    @Column()
    remark: string;

    @Column()
    introduction: string;
}
