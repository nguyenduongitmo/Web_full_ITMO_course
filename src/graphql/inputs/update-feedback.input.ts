import{ InputType, Field, Int} from '@nestjs/graphql'
import {IsString, IsEmail, IsInt, Min, Max, IsOptional} from 'class-validator'

@InputType()
export class UpdateFeedbackInput{
    @Field({nullable:true})
    @IsOptional()
    @IsString()
    fullName?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    comment?: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;
}
