import { ObjectType, Field, ID, Float } from "@nestjs/graphql";

@ObjectType() // Đánh dấu đây là Object Type trong GraphQL
export class Tour {
    @Field(() => ID) // ID là kiểu đặc biệt trong GraphQL
    id!: string;

    @Field() // mặc định là chuỗi, ko rỗng
    name!: string;

    @Field()
    image!: string;

    @Field()
    description!: string;

    @Field()
    code!: string;

    @Field(() => Float, { nullable: true })
    // dùng Float Vì price có thể là số thập phân
    // nullable: true vì price có thể null trong DB
    price: number | null = null; // Nullable thì khởi tạo null

    @Field({ nullable: true })
    duration?: string;  // Optional dùng ?

    @Field()
    isFeatured!: boolean;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}
