import mongoose from "mongoose";
import { Password } from "../services/password";
//an iteface that describes the properties that a required to create new User
interface UserAttrs {
  email: string;
  password: string;
}
//an iteface that describes the properties that a user model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}
//an inteface for User Document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
userSchema.pre("save", async function (done) {
  //if password is modified or created
  if (this.isModified("password")) {
    //get user password from the document an hash it
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
//call this function instead new User({}) for type checking
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export default User;
