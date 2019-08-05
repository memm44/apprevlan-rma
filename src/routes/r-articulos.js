const express = require('express')
const router = express.Router()
const Caso = require('../models/caso')
const Usuario = require('../models/usuarios')
const Actividad = require('../models/actividad')
const mongoose = require('mongoose')

router.get('/', async (req, res) => {
    
    if(req.params.id){
    const { id } = req.params
    const casoselected = await Caso.findOne({"articulos._id":id,},"articulos.$" )
    }else{
        casoselected=undefined
    }
    res.render('editararticulos',{casoselected} )
})

router.post('/addart/:id',(req,res) => {
    const { id } = req.params
    Caso.findById({_id:id})
    .then((enc) => {
        var limite=8
            if (enc.articulos.length===limite) {
               
                req.flash('mensajebad', `No puedes agregar mas de ${limite} articulos crea una hoja de detalle`)
                return res.redirect(`/editar/${id}`)
            }
                Caso.update({ _id: id}, {
                
                    $addToSet:{articulos:{
                            
                        codigo: req.body.adccod_art,
                        descripcion: req.body.adcdesc_art,
                        nserie: req.body.adcnserie,
                        nfact: req.body.adcnfactura,
                        reporte: req.body.adcdesc_reporte,
                        facturacionCTienda:{
                            codigo:req.body.adcdfactct,
                            valor:req.body.adcvalct
                        },
                        facturacionCmejia:{
                            codigo:req.body.adcdfactcm,
                            valor:req.body.adcvalcm,
                        },
                        transferencias:req.body.adcdtransf   
                           
                    
                        }
                    }
                  
                }).then(() => {
                    req.flash('mensaje', 'Articulo añadido correctamente')
                    res.redirect(`/`)
            
                })
            
            })
    })
    

   

router.get('/editararticulos/:cid/:id', async (req,res) => {
  
    const { id } = req.params
    const casoselected = await Caso.findOne({"articulos._id":id},"articulos.$" )
    res.render('editararticulos', { casoselected})
})
router.post('/editararticulos/:cid/:id', async (req, res) => {
     const {id}=req.params
     const {cid} = req.params
     
     const rt=await Caso.findOneAndUpdate({
        "articulos._id":id}, {$set:{
      
            "articulos.$.descripcion":req.body.desc_art,
            "articulos.$.codigo":req.body.codigo,
            "articulos.$.nserie": req.body.nserie,
            "articulos.$.nfact":req.body.nfact,
            "articulos.$.reporte":req.body.desc_reporte,
            "articulos.$.estado_final":req.body.efinal,
            "articulos.$.facturacionCTienda.codigo":req.body.ctdfact,
            "articulos.$.facturacionCTienda.valor":req.body.valctfact,
            "articulos.$.facturacionCmejia.codigo":req.body.cmdfact,
            "articulos.$.facturacionCmejia.valor":req.body.valcmfact,
            "articulos.$.transferencias":req.body.transferencias 
        }   
            })
            
    req.flash('mensaje','Actualizado correctamente')
    res.redirect(`/`)
    console.clear()
    console.log(rt)
})

router.get('/removeart/:cid/:id', (req,res) => {
    var { id } = req.params
    var { cid } = req.params
    Caso.findById({_id:cid})
        .then((caso) => {
            if (caso.articulos.length===1) {
                
                req.flash('mensajebad', 'Solo te queda un articulo debes eliminar el caso')
                return res.redirect('/')
            }
            Caso.updateOne({ _id: cid }, {
                $pull: {
                    articulos: {
                        _id: id
                    }
                }
            })
            .then(() => {
                    req.flash('mensaje', 'Articulo eliminado correctamente')
                    res.redirect(`/`)
    
        })
    })
})  
    

module.exports= router