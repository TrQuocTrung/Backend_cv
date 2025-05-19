import { Controller, Get, Inject } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schema/subscriber.schema';
import { Job, JOBDocument } from 'src/jobs/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';


@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
    @InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JOBDocument>
  ) { }
  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      if (jobWithMatchingSkills?.length) {
        const job = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: item.skills,

          }
        })
        await this.mailerService.sendMail({
          to: "trungtran147722@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from 
          subject: 'Welcome to Nice App! Confirm your Email',
          template: "job",
          context: {
            receiver: { name: subs.name },
            job: job,
            year: new Date().getFullYear()
          } // HTML body content 
        });
      }
      //todo
      //build template 
    }

  }
}
