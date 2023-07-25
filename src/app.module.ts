import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { MongoseFilter } from './common/filters/mongose-filter'; // Import the filter
import { APP_FILTER } from '@nestjs/core'; // Import the APP_FILTER token

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://nestapp:DnnhSoWzMFX4Qk2b@cluster0.d3talml.mongodb.net/'),
    UserModule,
  ],
  providers: [
    MongoseFilter, // Add the filter to the providers array
    {
      provide: APP_FILTER,
      useClass: MongoseFilter, // Register the filter as a global filter
    },
  ],
})
export class AppModule {}
