import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { MongoseFilter } from './common/filters/mongose-filter';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://nestapp:DnnhSoWzMFX4Qk2b@cluster0.d3talml.mongodb.net/'),
    JwtModule.register({
      secret: 'MbpCK6Myuh',
    }),
    UserModule,
    AuthModule
  ],
  providers: [
    MongoseFilter,
    {
      provide: APP_FILTER,
      useClass: MongoseFilter, 
    },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
