import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber, SubscriberSchema } from 'src/subscribers/schema/subscriber.schema';
import { Job, JobsSchema } from 'src/jobs/schemas/job.schema';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("EMAIL_HOST"),
          secure: false,
          auth: {
            user: configService.get<string>("SENDER_EMAIL"),
            pass: configService.get<string>("APP_PASSWORD"),

          },
        },
        template: {
          dir: join(process.cwd(), 'src', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
          preview: true,
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
      }),
      inject: [ConfigService],
    }),
    SubscribersModule, JobsModule,
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Job.name, schema: JobsSchema }
    ])
  ],
  controllers: [MailController],
  providers: [MailService, SubscribersModule, JobsModule]
})
export class MailModule { }
