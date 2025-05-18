
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Role } from 'src/roles/schema/role.schema';

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;
    @Prop({ required: true, unique: true })//Properti
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    age: number;

    @Prop()
    gender: string;

    @Prop()
    phone: number;

    @Prop()
    address: string;

    @Prop({ type: Object })
    company: {
        _id: mongoose.Schema.Types.ObjectId,
        name: string
    };

    @Prop({ type: mongoose.Types.ObjectId, ref: Role.name })
    role: mongoose.Types.ObjectId;

    @Prop()
    refresh_token: string;

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

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(softDeletePlugin);