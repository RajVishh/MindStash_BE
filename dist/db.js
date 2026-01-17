import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import 'dotenv/config';
const ObjectId = mongoose.Types.ObjectId;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}
mongoose.connect(MONGODB_URI);
const UserSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String
});
const BrainSchema = new Schema({
    title: String,
    link: String,
    tag: Array,
    UserId: ObjectId
});
const FilterSchema = new Schema({
    filterName: String,
    userId: { type: ObjectId, ref: 'users' }
});
const LinkSchema = new Schema({
    randomLink: { type: String, unique: true },
    userId: { type: ObjectId, ref: 'users', unique: true }
});
export const LinkModel = mongoose.model('link', LinkSchema);
export const UserModel = mongoose.model('user', UserSchema);
export const BrainModel = mongoose.model('brain', BrainSchema);
export const FilterModel = mongoose.model('filter', FilterSchema);
//# sourceMappingURL=db.js.map