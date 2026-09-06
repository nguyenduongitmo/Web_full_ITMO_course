import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Tour } from './tour.type';

@ObjectType()
export class PaginatedTours{
    @Field(() => [Tour])
    data!: Tour[];

    @Field(() => Int)
    total!: number;

    @Field(() => Int)
    page!: number;

    @Field(() => Int)
    limit!: number;

        @Field(() => Int)
    totalPages!: number;

    @Field()
    hasNext!: boolean;

    @Field()
    hasPrev!: boolean;
}