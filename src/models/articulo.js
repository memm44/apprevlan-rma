const mongoose = require('mongoose')
const esquema= mongoose.Schema
const usuarios = require('../models/usuarios')
const actividades= require('../models/actividad')
const esquemaArt= new esquema({
        usuario:{type:esquema.Types.ObjectId,ref:'usuarios'},
        codigo:String,
        descripcion:String,
        nserie:String,
        nfact:Number,
        reporte:String,
        facturacion:[{
            codigo:{type:String},
            valor:{type:Number}
        }],
        transferencia:[{
            numero:{type:Number},
            descripcion:{type:String}
        }],
        guiaSE:{type:String},

        
})

module.exports= mongoose.model('tabla_art', esquemaArt)