const mongoose= require('mongoose')
const esquema= mongoose.Schema;
const usuarios= require('../models/usuarios')
const Casos = require('../models/caso')
const hoja_stock =new esquema({
    encargado: [{type:esquema.Types.ObjectId,ref:'usuarios'}],
    fecha:{type:String},
    codigocaso:String,  
    creado:{type:Date, default:Date.now}, 
    transferencias:String,
    tipo_caso:{type:String,default:"Stock"},
    status:{
        titulo:{type:String,default:"revision"},
        descripcion:String
    },
    articulo:[{
        codigo:String,
        descripcion:String,
        observacion:String,
        completo:String,
        bodega_final:String,
        cantidad_items:Number
    }],
})

module.exports= mongoose.model('tabla_hojastock',hoja_stock)