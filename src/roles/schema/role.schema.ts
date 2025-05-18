import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";
import { Permission } from "src/permissions/schema/permission.schema";
import { User } from "src/users/schemas/user.schema";

export type RoleDocument = HydratedDocument<Role>
@Schema({ timestamps: true })
export class Role {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Permission' }] })
    permissions: Permission[];

    @Prop({ type: Date })
    deletedAt?: Date;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
    createdBy: {
        _id: mongoose.Types.ObjectId,
        name: string
    };

    @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
    updatedBy: {
        _id: mongoose.Types.ObjectId,
        name: string
    };

    @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
    deletedBy: {
        _id: mongoose.Types.ObjectId,
        name: string
    };
}
export const Roleschema = SchemaFactory.createForClass(Role);
Roleschema.plugin(softDeletePlugin);