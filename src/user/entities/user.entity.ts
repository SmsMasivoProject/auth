import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
    @Prop({
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
      })
      firstname: string;
    
      @Prop({
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
      })
      lastname: string;
    
      @Prop({
        type: String,
        minlength: 3,
        maxlength: 255,
        required: false,
      })
      phone: string;
    
      @Prop({
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
      })
      email: string;
    
      @Prop({
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
      })
      key: string;
    
      @Prop({
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
      })
      secret: string;
    
      @Prop({
        type: String,
        minlength: 0,
        maxlength: 255,
        required: false,
        default: "",
      })
      refreshToken: string;
    
      @Prop({
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
      })
      company_name: string;

      @Prop({
        type: Boolean,
        default: false,
      })
      blocked: Boolean;

      @Prop({
        type: [String],
        default: false,
      })
      roles: string[];
 }

export const UserSchema = SchemaFactory.createForClass(User);