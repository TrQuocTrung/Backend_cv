import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Companies } from 'src/companies/schemas/company.schema';
import { Job } from 'src/jobs/schemas/job.schema';

export type ResumeDocument = HydratedDocument<Resume>

@Schema({ timestamps: true })
export class Resume {
    @Prop()
    email: string

    @Prop({ type: Object })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    url: string

    @Prop()
    status: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Companies.name })
    companyId: mongoose.Schema.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Job.name })
    jobId: mongoose.Schema.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.Array })
    history: {
        status: string;
        updateAt: Date;
        updateBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string
        }
    }[]
    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: Boolean;

    @Prop()
    deletedAt: Date;

}
export const Resumechema = SchemaFactory.createForClass(Resume);
Resumechema.plugin(softDeletePlugin);
