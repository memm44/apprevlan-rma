const express = require('express')
const router = express.Router()
const Usuario = require('../models/usuarios')
const Caso = require('../models/caso')
const moment = require('moment')
const Actividad = require('../models/actividad')
const Hojastock = require('../models/hojastock')


    router.get('/',async(req, res) => {
  
        const casostock = await Hojastock.find({})
        Usuario.populate(casostock,  {path:"encargado"}, function (err,casostock) {
           
           Caso.find({})
       .exec((err,caso) => {
        if (err) {
            return res.status(500).send(err)
        }
         Usuario.populate(caso,  {path:"encargado"}, function (err,caso) {
            res.status(200).render('monitor', {caso,casostock,mensaje:req.flash('mensaje')})
           })
         })
       })
    })
     router.get('/tactividades/:pagina', (req,res) => {
        let porpagina = 20
        let pagina = req.params.pagina || 1
    
        Actividad.
        find({})
        .skip((porpagina*pagina)-porpagina)
        .limit(porpagina)
        .sort({creado:-1})
        .exec((err,act) => {
           Actividad.countDocuments((err,cuenta) => {
                if (err) {
                    return next(err)
                }
                Usuario.populate(act,  {path:"usuario"}, function (err,act) {
                    res.status(200).render('monitor2', 
                    {cuenta,act,actual:pagina,paginas:Math.ceil(cuenta/porpagina)})
                 })
                
            })
            
        })
    })
    router.post('/buscar', (req,res) => {
        const fechainicial = req.body.busqueda
        
        Actividad.find({$or:[{fecha:fechainicial},{codigocaso:fechainicial}]}, (err,actividades) => {
            if (err) {
                return console.log('error')
            }
            console.clear()
            console.log('encontraste resultado ....'+actividades)
            Usuario.populate(actividades, {path:"usuario"},(err,actividades) => {
                if (err) {
                    console.log(err)
                }
                res.render('dia_especifico',{actividades, mensaje:req.flash('mensaje')})
            })
            
            
        })
        
    })
    router.get('/usuarioact/:user', (req,res) => {

        const {user}= req.params
        Actividad.find({usuario:user}, (err,actividades) => {
            if (err) {
                return console.log('error')
            }
            console.clear()
            console.log('encontraste resultado ....'+actividades)
            Usuario.populate(actividades, {path:"usuario"},(err,actividades) => {
                if (err) {
                    console.log(err)
                }
                res.render('rev_diaespecifico',{user,actividades,mensaje:req.flash('mensaje')})
            })
            
            
        })
        
    })
    router.post('/buscarrev', (req,res) => {
        const codcaso= req.body.busqueda
        Caso.find({'ncaso.codigocaso':codcaso}, (err,caso) => {
            if (err) {
                return console.log('error')
            }
         
            Usuario.populate(caso,  {path:"encargado"}, function (err,caso) {
                
                res.status(200).render('monitor', {caso, mensaje:req.flash('mensaje')})
             })
            
            
        })
        
    })
    router.post('/buscarfechatecnico', async (req,res) => {
        const fechainicial = req.body.busqueda
     
        Actividad.find({usuario:req.body.idtecnico,fecha:fechainicial}, (err,actividades) => {
            if (err) {
                return console.log('error')
            }
            console.clear()
            console.log('encontraste la fecha'+actividades)
            res.render('rev_diaespecifico2',{actividades, mensaje:req.flash('mensaje')})
            
        })
        
    })

module.exports= router