import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber } from 'rxjs';
import { SubscriberSchema } from './schema/subscriber.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Subscriber.name, schema: SubscriberSchema },
  ])],
  controllers: [SubscribersController],
  providers: [SubscribersService],
  exports: [MongooseModule]
})
export class SubscribersModule { }
