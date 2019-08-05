const express = require('express')
const router = express.Router()
const Usuario = require('../models/usuarios')
const Desktop = require('../models/desktops')
const mongoose = require('mongoose')
const moment = require('moment')


router.get('/',async (req,res) => {
    var fecha_actual = moment().format('YYYY-MM-DD')
    var cuenta = await Desktop.find({})
    console.log(' esta es la cuenta que llevaaaaaaaaaaaaaaaaaaaaaaaaaaaas'+cuenta)
    console.log(`esta es la fecha actual ${fecha_actual}`); 
    var todos = await Desktop.find({usuario:req.user._id,fecha:fecha_actual}).sort({creado:-1})
    Desktop.findOne({})
    .sort({creado:-1})
    
    .exec(function (err,ultimo) {
        if (err) {
            console.log('hubo un error')
        }
        Usuario.populate(ultimo,  {path:"usuario"}, function (err,ultimo) {
            if (err) {
                console.log('ocurrio un error')
            }
            
            res.status(200).render('desktops', {ultimo,cuenta,todos,base:req.baseUrl,mensaje: req.flash('mensaje'),
            mensajebad:req.flash('mensajebad')})
         })
        console.log('este es el ultimooo' +ultimo)
        
    })
})
router.post('/add', (req,res) => {
    const ensamble = new Desktop({
        usuario:req.user._id,
        fecha:req.body.fechahoy,
        serieEnsamble:{
            numero:req.body.numero,
            serie:req.body.serienueva
        },
        mainboard:{
            descripcion:req.body.modpb,
            serie:req.body.seriepb
        },
        procesador:{
            descripcion:req.body.modproc,
            serie: req.body.serieproc
        },
        disco_duro:{
            descripcion:req.body.modhdd,
            serie: req.body.seriehdd
        },
        memoria_ram:{
            descripcion:req.body.modmem,
            serie:req.body.seriemem
        },
        udvd:{
            descripcion:req.body.modmem,
            serie:req.body.seriemem
        },
        case:{
            descripcion:req.body.case,

        }
    })
    ensamble.save()
    console.log(ensamble)
    console.log(ensamble.genserie)

    res.redirect('/desktops')
    
})
router.get('/delete/:id', (req, res) => {
    Desktop.findByIdAndDelete({ _id: req.params.id }, function (err) {
        if (err) {
            console.log("hubo un error")
        }
        req.flash('mensaje', 'has eliminado una serie Desktop de tu lista')
        console.log("ELIMINADO")
        res.redirect('/desktops');
    })
})
router.get('/editar/:id', async (req,res) => {
  
    const { id } = req.params
    
    const desktopselected = await Desktop.findOne({_id:id})
    console.log(desktopselected)
    res.render('editar_desktops', { desktopselected, base: req.baseUrl + 'usuarios' })
})

router.get('/impseries', (req,res) => {
    res.render('impseries')
})
router.post('/editar/:id', async (req, res) => {

    const { id } = req.params
    const result= await Desktop.findOneAndUpdate({ _id: id }, {
        mainboard:{
            descripcion:req.body.modpb,
            serie:req.body.seriepb
        },
        procesador:{
            descripcion:req.body.modproc,
            serie: req.body.procserie
        },
        disco_duro:{
            descripcion:req.body.modhdd,
            serie: req.body.seriehdd
        },
        memoria_ram:{
            descripcion:req.body.modmem,
            serie:req.body.seriemem
        },
        udvd:{
            descripcion:req.body.udvdmod,
            serie:req.body.udvdserie
        },
        case:{
            descripcion:req.body.case,

        }
    })
    
    console.log('actualizado'+result)
    req.flash('mensaje', 'has actualizado correctamente el registro')
    res.redirect('/desktops')
})
router.post('/buscar', (req,res) => {
    
   const busqueda = req.body.busqueda
    Desktop.find({usuario:req.user._id,$or:[{'serieEnsamble.serie':busqueda},{fecha:busqueda}]}, (err,serie) => {
        if (err) {
            return console.log('error')
        }
        console.clear()
        
        console.log(serie)
        res.render('serie_especifica',{serie, mensaje:req.flash('mensaje')})
    
    })
})
router.get('/tdesktops/:pagina', (req,res) => {
    let porpagina = 20
    let pagina = req.params.pagina || 1

    Desktop.
    find({usuario:req.user._id})
    .skip((porpagina*pagina)-porpagina)
    .limit(porpagina)
    .exec((err,desk) => {
       Desktop.countDocuments((err,cuenta) => {
            if (err) {
                return next(err)
            }
            res.render('tdesktops',{
                desk:desk,
                actual:pagina,
                base: req.baseUrl,
                paginas: Math.ceil(cuenta/porpagina)
            })
        })
        
    })
})
module.exports= router