const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    topic:{
        type:String,
        required:true
    }, 
    description:{
        type:String,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true 
    },
    date:{
        type:Date,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    favourite: {
        type: Boolean,
        default: false
    }    
})

module.exports = mongoose.model('Events', eventSchema);