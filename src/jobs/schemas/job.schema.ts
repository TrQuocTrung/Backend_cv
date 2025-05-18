import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type JOBDocument = HydratedDocument<Job>;
@Schema({ timestamps: true })
export class Job {
    @Prop()
    name: string;

    @Prop()
    skills: string[];

    @Prop({
        type: {
            _id: mongoose.Schema.Types.ObjectId,
            name: String,
            logo: String
        }
    })

    company: {
        _id: mongoose.Schema.Types.ObjectId,
        name: string,
        logo: string
    };

    @Prop()
    location: string;

    @Prop()
    salary: number;

    @Prop()
    quantity: number;

    @Prop()
    level: string;

    @Prop()
    description: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    isActive: boolean;

    @Prop({
        type: {
            _id: mongoose.Schema.Types.ObjectId,
            name: String,
        }
    })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        name: string
    }
    @Prop({
        type: {
            _id: mongoose.Schema.Types.ObjectId,
            name: String,
        }
    })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        name: string
    }
    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}
export const JobsSchema = SchemaFactory.createForClass(Job);
JobsSchema.plugin(softDeletePlugin);
