var mongoose = require('mongoose');

var blogschema = new mongoose.Schema({

    name:{
        type:String
    },
    price:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

module.exports = mongoose.model("blog",blogschema);