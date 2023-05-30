import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    did: {
        type: String,
        required: true,
    },
});

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
