import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './user/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';

const jwtFactory = {
  useFactory: async () => {
    return {
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_SECRET_KEY_EXPIRES,
      },
    };
  }
};
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.HOSTNAME_MONGO}:${process.env.PORT_MONGO}`,
      {
        dbName: `${process.env.DATABASE_MONGO}`
      }
    ),
    JwtModule.registerAsync(jwtFactory),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },],
  exports: [AppService]
})
export class AppModule { }
