import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  isEmployee: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  inEmailList: boolean;
  twoFaSecret: string;
  refreshToken?: string;
  resetPasswordToken: string;
  resetPasswordExpires: number;
  matchPassword(enteredPassword: string): Promise<boolean>;
  //employeeTotalSalary??
  //job title
  // customerCompany:{
  //   name: string;
  //   website: string;
  // }
}

const UserSchema: Schema = new Schema({
  firstName: { 
    type: String,
     required: true 
  },
  lastName: { 
    type: String,
     required: true 
  },
  fullName: { 
    type: String,
     required: true 
  },
  email: { 
    type: String,
     required: true 
  },
  password: { 
    type: String
  },
  isEmployee: {
    type: Boolean,
    required: true,
    default: false
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  },
  isSuperAdmin: {
    type: Boolean,
    required: false,
    default: false
  },
  inEmailList: {
    type: Boolean,
    required: false,
    default: false
  },
  twoFaSecret: {
    type: String,
    required: false,
    default: null
  },
  refreshToken: {
    type: String,
    required: false,
    default: null
  },
  resetPasswordToken: {
    type: String,
    required: false,
    default: null
  },
  resetPasswordExpires: {
    type: Number,
    required: false,
    default: null
  },
}, {
  timestamps: true,
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password); //see if enter password matches the password in the db
};

UserSchema.pre('save', async function (next){
  
  if(!this.isModified('password')){
      next(); 
  }; //if dealing with user data without password it will move on
  
  //if modifying password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password + '', salt);
}); // .pre - allows us to do something before the data is saved in the db, .post is to do something after saved in db


const User = mongoose.model<IUser>('User', UserSchema);

export default User;