import mongoose from "mongoose";
import { cartCollection } from "./cart.model.js";

const userCollection = "users";

const userSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: cartCollection,
	},
	role: {
		type: String,
		required: true,
		enum: ["usuario", "admin"],
		default: "usuario",
	},
});

export const UserModel = mongoose.model(userCollection, userSchema);
