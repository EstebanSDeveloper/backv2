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
		enum: ["user", "admin", "premium"],
		default: "user",
	},
	documents:{
		type: [
			{
				name: {type: String, required: true},
				reference: {type: String, required: true}
			}
		],
		default: []
	},
	last_connection: {
		type: Date, // formato JS enviado de esta manera: new Date() 
		default: null
	},
	status:{
		type: String,
		required: true,
		enum: ["complete", "incomplete", "waiting"],
		default: "waiting"
	},
	avatar:{ type: String, default:""}
});

export const UserModel = mongoose.model(userCollection, userSchema);
