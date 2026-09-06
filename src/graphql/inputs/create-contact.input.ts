import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateContactInput {
    @Field()
    @IsString()
    fullName!: string;

    @Field()
    @IsEmail()
    email!: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    phone?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    interest?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    destination?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    budget?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    travelDate?: string;

    @Field()
    @IsString()
    message!: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    subscribe?: boolean;

}