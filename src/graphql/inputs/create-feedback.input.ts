import { InputType, Field, Int } from "@nestjs/graphql";
import { IsString, IsInt, IsEmail, Min, Max, IsOptional} from 'class-validator'

@InputType()
export class CreateFeedbackInput{
    @Field()
    @IsString()
    fullName! : string;

    @Field()
    @IsEmail()
    email!: string;

    @Field()
    @IsString()
    comment!: string;


    @Field(() => Int)
    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    tourId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    userId?: string;
}