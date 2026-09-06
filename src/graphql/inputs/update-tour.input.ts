import { InputType, Field, Float, PartialType } from '@nestjs/graphql';
import { CreateTourInput } from './create-tour.input';
import { IsOptional, IsString, IsNumber, IsBoolean, IsUrl } from 'class-validator';

@InputType()
export class UpdateTourInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsUrl()
    image?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    code?: string;

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
