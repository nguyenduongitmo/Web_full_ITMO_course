import { ObjectType, Field, ID, Int} from "@nestjs/graphql";

@ObjectType()
export class Contact{
    @Field(() => ID)
    id! : string

    @Field()
    fullName!: string;

    @Field()
    email!: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    interest?: string;

    @Field({ nullable: true })
    destination?: string;

     @Field({ nullable: true })
    budget?: string;

    @Field({ nullable: true })
    travelDate?: string;

    @Field()
    message!: string;

    @Field()
    subscribe!: boolean;

    @Field()
    createdAt!: Date;
}