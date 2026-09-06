import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ToursModule } from '../tours/tours.module';
import { BookingsModule } from '../bookings/bookings.module';
import { FeedbacksModule } from '../feedbacks/feedbacks.module';
import { ContactsModule } from '../contacts/contacts.module';
import { ToursResolver } from './resolvers/tours.resolver';
import { BookingsResolver } from './resolvers/bookings.resolver';
import { FeedbacksResolver } from './resolvers/feedbacks.resolver';
import { ContactsResolver } from './resolvers/contacts.resolver';

@Module({
    imports: [
        ToursModule, BookingsModule, FeedbacksModule, ContactsModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            // tự động tạo tệp schema.gql để debug
            autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),

            sortSchema: true,
            // bật Graphql Playground tại /graphql
            playground: true,

            // cho phép resolver truy cập request object (dùng cho auth sau)
            context: ({ req }) => ({ req }),
        }),
    ],

    providers: [
        ToursResolver, BookingsResolver, FeedbacksResolver, ContactsResolver,
    ],
})
export class GraphqlModule { }

