const mongoose = require('mongoose')
const esquema = mongoose.Schema

const nuevoreg= new esquema({
    nombre:{type:String,required:'debes usar nombre'},
    apellido:{type:String}

})

module.exports= mongoose.model('prueba',nuevoreg)