import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

@InputType()
export class CreateTourInput {
    @Field()
    @IsString()
    name: string = "";
    
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    image?: string;

    @Field()
    @IsString()
    description: string = "";

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    code?: string;  // Nếu không có, service tự generate

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    price?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    duration?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
}