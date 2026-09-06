import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { StringValueNode } from 'graphql';

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

}