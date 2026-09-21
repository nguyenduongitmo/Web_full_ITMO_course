import {ObjectType, Field, ID, Int} from '@nestjs/graphql';
import { Tour } from './tour.type';

@ObjectType()
export class Feedback{
    @Field(() => ID)
    id! : string;

    @Field()
    fullName! : string;

    @Field()
    email! : string;

    @Field()
    comment! : string;

    @Field()
    rating! : string;

    @Field()
    createdAt! : Date;

    @Field()
    tourId!: string;
    
    @Field(() => Tour, { nullable: true })
    tour?: Tour;

}