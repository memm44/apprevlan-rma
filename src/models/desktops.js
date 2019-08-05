const mongoose= require('mongoose')
const usuarios= require('./usuarios')
const esquema = mongoose.Schema


const ensamble = new esquema({
    usuario: [{type:esquema.Types.ObjectId,ref:'usuarios'}],
    fecha:String,
    creado:{type:Date, default: Date.now},
    serieEnsamble: {
        numero:Number,
        serie: String
    },
    mainboard: {
        descripcion:String,
        serie:{type:String,require:'serie requerida'}
    },
    procesador: {
        descripcion:{type:String},
        serie:{type:String,require:'serie requerida'}
    },
    disco_duro:{
        descripcion:String,
        serie:{type:String,require:'serie requerida'}
    },
    memoria_ram:{
       descripcion:String,
        serie:{type:String,required:'serie requerida'}
    },
    udvd:{
        descripcion:String,
        serie:{type:String,required:'serie requerida'}
    },
    case:{
        descripcion:String,
    }

})





module.exports= mongoose.model('tabla_desktops',ensamble) 