const mongoose= require('mongoose')
const esquema= mongoose.Schema;
const usuarios= require('../models/usuarios')
const moment = require('moment')
const Casos = require('../models/caso')
const Act_diarias =new esquema({
    usuario: [{type:esquema.Types.ObjectId,ref:'usuarios'}],
    fecha:{type:String},
    caso:{
        type:esquema.ObjectId,
        ref:"Casos",
    },
    creado:{type:Date,default:Date.now},
    codigocaso:String,
    tienda:String,
    id_articulorev:String,
    codigo_art:String,
    articulorev:String,
    hinicio:String,
    hfin:String,
    reporte:String,
    act_realizada:String,

})
// Act_diarias.virtual('fechaCorta')
// .get(function () {
//     return `${this.fecha.getFullYear()}-${this.fecha.getMonth()+1}-${this.fecha.getDate()}`
// })

module.exports= mongoose.model('tabla_actividades',Act_diarias)