const mongoose = require('mongoose');

const foodSchema=new mongoose.Schema({
    foodName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    }
});

const Food = mongoose.model('Food',foodSchema);

module.exports=Food;