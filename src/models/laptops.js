const mongoose = require('mongoose')
const usuarios= require('../models/usuarios')
const esquema= mongoose.Schema
const laptops = new esquema({
    usuario: [{type:esquema.Types.ObjectId,ref:'usuarios'}],
    modelo:String,
    serie:{type:String,required:'serie requerida'}
})

module.exports= mongoose.model('tabla_laptops',laptops)