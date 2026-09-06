import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ToursModule } from '../tours/tours.module';
import { ToursResolver } from './resolvers/tours.resolver';

@Module({
    imports: [
        ToursModule,
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
        ToursResolver,
    ],
})
export class GraphqlModule { }

