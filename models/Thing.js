const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ThingSchema = new Schema({
	subject : {
		type: String,
		required: true
	},
	details : {
		type: String,
		required: true
	},
	user : {
		type: String,
		required: true
	},
	category : {
		type: String,
		required: false
	},
	priority : {
		type: Number,
		required: true
	},
	status : {
		type: String,
		required: true
	},
	link : {
		type: String,
		required: false
	},
	deadline: {
		type: Date,
		required: false
	},
	dateCreated: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('things', ThingSchema);