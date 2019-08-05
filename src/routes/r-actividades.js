const express = require('express')
const router = express.Router()
const Caso = require('../models/caso')
const mongoose = require('mongoose')
const Usuario = require('../models/usuarios')
const Actividad = require('../models/actividad')
const moment = require('moment')
const Hojastock = require('../models/hojastock')

router.get('/',async (req, res) => {
    var fecha_actual = moment().format('YYYY-MM-DD')
    console.log(`esta es la fecha actual ${fecha_actual}`); 

  
    const casos= await Caso.find({encargado:req.user._id,rep_final:""})
   Actividad.find({usuario:req.user._id,fecha:fecha_actual},(err,act) => {
       
       if (err) {
           return res.status(500).send(err)
       }
       res.render('actividadesdiarias', {act,casos,mensaje:req.flash('mensaje'),mensajebad:req.flash('mensaje'),act })
   })
    
    
   
})

///////////////////////////////////////////// JSON /////////////////////////////////////////////////////////////////////////
router.get('/json/:id', async (req, res) => {
    const {id}=req.params
    const casos= await Caso.findOne({"ncaso.codigocaso":id})
    res.json(casos)
})
router.get('/json/:id/:idarticulo', async (req, res) => {
    const {id}=req.params
    const {idarticulo}= req.params
    const articulo= await Caso.findOne({"articulos._id": {$in:[idarticulo]}})
    res.json(articulo)
})
/////////////////////////////////////////// CREAR ACTIVIDAD //////////////////////////////////////////////////
router.post('/addact',async (req,res) => {
    var nuevo = mongoose.Types.ObjectId()
    const act = new Actividad({
        usuario: req.user._id, 
        fecha:req.body.fechahoy,
        caso:req.body.genid || null,
        codigocaso:req.body.desc_caso,
        hinicio:req.body.hinicio,
        hfin:req.body.hfin,
        articulorev:req.body.articulo,
        codigo_art:req.body.codigoarticulo,
        id_articulorev:req.body.genid ,
        reporte_art:req.body.reporteart,
        tienda:req.body.tienda || 'Mejia',
        reporte:req.body.reporteart,
        id_articulorev:req.body.radioarticulo,
        act_realizada: req.body.actividadrealizada
    })
    await act.save()
    const result= await Caso.findOneAndUpdate({ _id: req.body.genid || nuevo}, {
        status:{
            titulo:req.body.statustitulo,
            descripcion:req.body.statusdescripcion || "sin descripcion"
        },
    
    })
    const result2= await Hojastock.findOneAndUpdate({ codigocaso: req.body.tienda || nuevo}, {
        status:{
            titulo:req.body.statustitulo,
            descripcion:req.body.statusdescripcion || "sin descripcion"
        },
    
    })
    console.log(act)
    req.flash("mensaje",'Actividad Guardada con Éxito')
    res.redirect('/actdiarias')
})

router.get('/tactividades/:pagina', (req,res) => {
    let porpagina = 20
    let pagina = req.params.pagina || 1

    Actividad.
    find({usuario:req.user._id})
    .skip((porpagina*pagina)-porpagina)
    .limit(porpagina)
    .exec((err,act) => {
       Actividad.countDocuments((err,cuenta) => {
            if (err) {
                return next(err)
            }
            res.render('tactividades',{
                act:act,
                actual:pagina,

                paginas: Math.ceil(cuenta/porpagina)
            })
        })
        
    })
})


router.post('/buscar', async (req,res) => {
    const fechainicial = req.body.busqueda
 
    Actividad.find({usuario:req.user._id,$or:[{fecha:fechainicial},{codigocaso:fechainicial}]}, (err,actividades) => {
        if (err) {
            return console.log('error')
        }
        console.clear()
        console.log('encontraste la fecha'+actividades)
        res.render('dia_especifico',{actividades, mensaje:req.flash('mensaje')})
        
    })
    
})
router.get('/editar/:id', async (req,res) => {
    const {id} = req.params
    const actselected = await Actividad.findOne({_id:id})
    res.render('editar_actividad',{actselected})
})
router.post('/editar/:id', async (req, res) => {

    const { id } = req.params
    const result= await Actividad.findOneAndUpdate({ _id: id }, {
        hinicio:req.body.hinicio,
        hfin: req.body.hfin,
        act_realizada:req.body.act_realizada
    })
    
    console.log('actualizado'+result)
    req.flash('mensaje', 'has actualizado correctamente tu Actividad')
    res.redirect('/actdiarias')
})

router.get('/delete/:id', (req, res) => {
    Actividad.findByIdAndDelete({ _id: req.params.id }, function (err) {
        if (err) {
            console.log("hubo un error")
        }
        req.flash('mensaje', 'has eliminado una actividad de tu lista')
        console.log("ELIMINADO")
        res.redirect('/actdiarias');
    })
})
module.exports= router