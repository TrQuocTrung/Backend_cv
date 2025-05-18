
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<Companies>;
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema({ timestamps: true })
export class Companies {
    @Prop({ required: true })
    name: string;

    @Prop()
    address: string;

    @Prop()
    logo: string;

    @Prop()
    description: string;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    updateBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ default: null })
    deletedAt: Date;
}

export const CompaniesSchema = SchemaFactory.createForClass(Companies);
CompaniesSchema.plugin(softDeletePlugin);