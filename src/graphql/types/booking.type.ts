import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { StringValueNode } from 'graphql';
import { Tour } from './tour.type';

@ObjectType()
export class Booking{
    @Field(() => ID)
    id!: string;

    @Field()
    bookingCode!: string;

    @Field()
    fullName!: string;

    @Field()
    email!: string;

    @Field()

    @Field({ nullable: true })
    phone?: string;

    @Field()
    travelDate!: Date;

    @Field(() => Int)
    passengers!: number;

    @Field()
    status!: string;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;

    @Field()
    tourId!: string;

    @Field(() => Tour, { nullable: true })
    tour?: Tour;
}