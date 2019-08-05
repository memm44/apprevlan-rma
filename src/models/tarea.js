const mongoose= require('mongoose')
// var ObjectId= require('mongodb').ObjectId;
const esquema= mongoose.Schema;

const esquemaTarea= new esquema({
    titulo: String,
    descripcion: String,
    status:{
        type:Boolean,
        default:false
    }
})

module.exports= mongoose.model('tareas',esquemaTarea)