import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { User } from "src/users/schemas/user.schema";

export type PermissionDocument = HydratedDocument<Permission>
@Schema({ timestamps: true })
export class Permission {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    apiPath: string;

    @Prop({ required: true })
    method: string;

    @Prop({ required: true })
    module: string;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;

    @Prop({ type: Date })
    deletedAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        name: string
    };

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        name: string
    };

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        name: string
    };
}
export const PermissionShema = SchemaFactory.createForClass(Permission);
PermissionShema.plugin(softDeletePlugin);