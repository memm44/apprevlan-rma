const mongoose = require('mongoose')
const esquema= mongoose.Schema
const usuarios = require('../models/usuarios')
const esquemaArt= new esquema({
        usuario:{type:esquema.Types.ObjectId,ref:'usuarios'},
        tecnico:String,
        codigocaso:String,
        fechaingCT:String,
        numcaso:String,
        tipo_caso:String,
        tienda:{type:String,set:asignartiendaXcodigo},
        observacion:String,
        vendedor:String,
        guia_se:String,
        fecha_registro:String
       
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
module.exports= mongoose.model('tabla_asignaciones', esquemaArt)