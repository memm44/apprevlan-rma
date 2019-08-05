const mongoose = require('mongoose')
const usuarios= require('./usuarios')
const esquema = mongoose.Schema

const instalacion = new esquema({
    usuario: [{type:esquema.Types.ObjectId,ref:'usuarios'}],
    fecha:String,
    creado:{type:Date, default: Date.now},
    serieEnsamble: {
        numero:Number,
        serie:String,
    },
    dvr:{
        descripcion:String,
        serie:String,
    },
    disco_duro:{
        descripcion:String,
        serie:String
    }

})
module.exports= mongoose.model('tabla_dvr',instalacion) 