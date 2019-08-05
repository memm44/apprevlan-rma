const express = require('express')
const router = express.Router()
const Usuario = require('../models/usuarios')
const DVR= require('../models/dvrs')
const moment = require('moment')

router.get('/',async (req,res) => {
    var fecha_actual = moment().format('YYYY-MM-DD')
    console.log(`esta es la fecha actual ${fecha_actual}`); 
    const todos = await DVR.find({usuario:req.user._id,fecha:fecha_actual}).sort({ creado:-1})
    console.log(todos)
    DVR.findOne({})
    .sort({creado:-1})
    
    .exec(function (err,ultimo) {
        if (err) {
            console.log('hubo un error')
        }
        Usuario.populate(ultimo,  {path:"usuario"}, function (err,ultimo) {
            res.status(200).render('dvr', {ultimo,todos,mensaje: req.flash('mensaje'),
            mensajebad:req.flash('mensajebad')})
         })
        console.log('este es el ultimooo' +ultimo)
        
    })

})
router.get('/json/:serie', async (req,res) => {
    const {serie}= req.params
    const serieDVR = await DVR.findOne({"serieEnsamble.serie":serie})
    console.clear()
   console.log(serieDVR)
    res.json(serieDVR)
})

router.post('/add', (req,res) => {
    const instalacion = new DVR({
        usuario:req.user._id,
        fecha:req.body.fechahoy,
        serieEnsamble:{
            numero:req.body.numero,
            serie:req.body.serienueva
        },
        dvr:{
            descripcion:req.body.dvrdesc,
            serie:req.body.dvrserie
        },
        disco_duro:{
            descripcion:req.body.hdddesc,
            serie: req.body.hddserie
        }
    })
    instalacion.save()
    req.flash('mensaje', 'Registro guardado con Exito')
    res.redirect('/dvr')
    
})
router.get('/editar/:id', async (req,res) => {
  
    const { id } = req.params
    
    const dvrselected = await DVR.findOne({_id:id})
    console.log(dvrselected)
    res.render('editar_dvr', { dvrselected})
})
router.post('/editar/:id', async (req, res) => {

    const { id } = req.params
    const result= await DVR.findOneAndUpdate({ _id: id }, {
        dvr:{
            descripcion:req.body.dvrdesc,
            serie:req.body.dvrserie
        },
        disco_duro:{
            descripcion:req.body.hdddesc,
            serie: req.body.hddserie
        },
    })
    
    console.log('actualizado'+result)
    req.flash('mensaje', 'has actualizado correctamente el dvr')
    res.redirect('/dvr')
})

router.get('/impseries2', (req,res) => {
    res.render('impseries2')
})
router.post('/buscar', (req,res) => {
    
    const busqueda = req.body.busqueda
     DVR.find({$or:[{'serieEnsamble.serie':busqueda},{fecha:busqueda}]}, (err,serie) => {
         if (err) {
             return console.log('error')
         }
         console.clear()
         
         console.log(serie)
         res.render('seriedvr_especifica',{serie, mensaje:req.flash('mensaje')})
     
     })
 })
 router.get('/delete/:id', (req, res) => {
    DVR.findByIdAndDelete({ _id: req.params.id }, function (err) {
        if (err) {
            console.log("hubo un error")
        }
        req.flash('mensaje', 'has eliminado una serie DVR de tu lista')
        res.redirect('/dvr');
    })
})
 router.get('/tdvrs/:pagina', (req,res) => {
    let porpagina = 20
    let pagina = req.params.pagina || 1

    DVR.
    find({usuario:req.user._id})
    .skip((porpagina*pagina)-porpagina)
    .limit(porpagina)
    .exec((err,dvr) => {
       DVR.countDocuments((err,cuenta) => {
            if (err) {
                return next(err)
            }
            res.render('tdvrs',{
                dvr:dvr,
                actual:pagina,
                paginas: Math.ceil(cuenta/porpagina)
            })
        })
        
    })
})
module.exports= router