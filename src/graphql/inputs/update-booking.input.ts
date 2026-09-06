import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsEmail, IsInt, IsDateString, Min } from 'class-validator';

@InputType()
export class UpdateBookingInput{
    @Field({nullable:true})
    @IsOptional()
    @IsString()
    fullName?:string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    phone?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    travelDate?: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    passengers?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    status?: string;
}