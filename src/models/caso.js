const mongoose= require('mongoose')
const usuarios= require('../models/usuarios')
const moment = require('moment')
const esquema= mongoose.Schema;

const Casos= new esquema({
    tienda:{
        codigo:{type:String},
        nombre:{type:String,set:asignartiendaXcodigo},
    },
    creado:{type:Date,default:Date.now},
    fechaIngCT:{type:String},
    fechaIng:{type:String},
    articulos:[{
        codigo:String,
        descripcion:String,
        nserie:String,
        nfact:String,
        reporte:String,
        vendedor:String,
        estado_final:String,
        facturacionCTienda:{
            codigo:String, 
            valor:Number,
        },
        facturacionCmejia:{
            codigo:String, 
            valor:Number,
        },
        transferencias:String,
    }],
    ncaso: { 
        numcaso:{type:String},
        codigocaso:{type: String}
        
    },
    cliente:{
        nombre:String,
        apellido:String,
        direccion:String,
        telefonos:String
    },
    tipo_caso:String, 
    encargado:[{type:esquema.Types.ObjectId,ref:'usuarios'}],
    status:{
        titulo:{type:String,default:'revision'},
        descripcion:{type:String}
    },
    rep_final:String, 
    envio:{
        guia:{type:String,default:''},
        fechaEnv:{type:Date, default:null}
    }
})



function asignartiendaXcodigo (codigoTienda) {
    var tienda;
    switch (codigoTienda) {
        case '012':
            tienda = 'Mejia'
            break;
        case '015':
            tienda = 'Machala'
            break;
        case '014':
            tienda = 'Manta'
            break;
        case '09':
            tienda = 'PortoViejo'
            break;
        case '08':
            tienda = 'Babahoyo'
            break;
        case '06':
            tienda = 'Playas'
            break;
        case '03':
            tienda = 'Loja'
            break;
        case '011':
            tienda = 'Riobamba'
            break;
        case '05':
            tienda = 'Duran'
            break;
        case '010':
            tienda = 'BahiaC'
            break;
        case '016':
            tienda = 'Daule'
            break;
        case '07':
            tienda = 'Peninsula'
            break;
        case '01':
            tienda = 'Montañita'
            break;
        case '00':
            tienda = 'Otra'
            break;
        default:
            tienda = this.tienda.codigo
            break;
    }
 return tienda;
}



module.exports= mongoose.model('tabla_casos',Casos)
// primer parametro como se llama la coleecion en mongo
//segundo es la variable que representa el esquema antes definido


