var mongoose = require('mongoose');


var userschema = new mongoose.Schema({

	email:{
		type:String
	},
	password:{
		type:String
	},
	image:{
		type:String
	}
}) 

module.exports = mongoose.model("user", userschema);