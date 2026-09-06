import {InputType, Field, Int} from '@nestjs/graphql';
import { IsString, IsEmail, IsInt, IsDateString, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateBookingInput{
    @Field()
    @IsString()
    userId!: string;

    @Field()
    @IsString()
    tourId!: string;

    @Field()
    @IsString()
    fullName!: string;

    @Field()
    @IsEmail()
    email!: string;

    @Field()
    @IsOptional()
    @IsString()
    phone?: string;

    @Field()
    @IsDateString()
    travelDate!: string;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    passengers!: number;
}