const express = require('express')
const router = express.Router()
const Usuario = require('../models/usuarios')
const Asignaciones = require('../models/asignaciones')
const moment = require('moment')

router.get('/',async (req,res) => {
    var fecha_actual = moment().format('YYYY-MM-DD')
    console.log(`esta es la fecha actual ${fecha_actual}`); 
    const todos = await Asignaciones.find({fecha_registro:fecha_actual})
    console.log(todos)
    Asignaciones.findOne({})
    .sort({creado:-1})
    
    .exec(function (err,ultimo) {
        if (err) {
            console.log('hubo un error')
        }
        Usuario.populate(ultimo,  {path:"usuario"}, function (err,ultimo) {
            res.status(200).render('asignaciones', {ultimo,todos,mensaje: req.flash('mensaje'),
            mensajebad:req.flash('mensajebad')})
         })
        console.log('este es el ultimooo' +ultimo)
        
    })

})
router.post('/add', (req,res) => {
    const asignar = new Asignaciones({
        usuario:req.user._id,
        tecnico:req.body.tecnico,
        numcaso:req.body.numcaso,
        codigocaso:req.body.desc_tienda+'-'+req.body.numcaso,
        tipo_caso:req.body.tipo_caso,
        tienda:req.body.desc_tienda,
        guia_se:req.body.nguia,
        observacion:req.body.observacion,
        fechaingCT:req.body.fechaingCT,
        vendedor:req.body.vendedor,
        fecha_registro:req.body.fechahoy,

    })
    asignar.save()
    console.log(asignar)
    console.clear()
    req.flash('mensaje', 'Registro guardado con Exito')
    res.redirect('/asignaciones')
    
})
router.get('/editar/:id', async (req,res) => {
    const {id} = req.params
    const asgselected = await Asignaciones.findOne({_id:id})
    res.render('editar_asignacion',{asgselected})
})
router.post('/editar/:id', async (req, res) => {

    const { id } = req.params
    const result= await Asignaciones.findOneAndUpdate({ _id: id }, {
        tecnico:req.body.tecnico,
        codigo_caso:req.body.codigo_caso,
        tipo_caso:req.body.tipo_caso,
        tienda:req.body.Tienda,
        guia_se:req.body.nguia,
        observacion:req.body.observacion,
        fechaingCT:req.body.fechaingCT,
        vendedor:req.body.vendedor,
    })
    
    console.log('actualizado'+result)
    req.flash('mensaje', 'has actualizado correctamente tu Asignación')
    res.redirect('/asignaciones')
})
router.post('/buscar', (req,res) => {
    
    const busqueda = req.body.busqueda
     Asignaciones.find({$or:[{tecnico:busqueda},{fecha_registro:busqueda},{codigo_caso:busqueda}]}, (err,resultado) => {
         if (err) {
             return console.log('error')
         }
         console.clear()
         
         res.render('asg_especifica',{resultado, mensaje:req.flash('mensaje')})
     
     })
 })
router.get('/tasignaciones/:pagina', (req,res) => {
    let porpagina = 20
    let pagina = req.params.pagina || 1

    Asignaciones.
    find({})
    .skip((porpagina*pagina)-porpagina)
    .limit(porpagina)
    .exec((err,asg) => {
      Asignaciones.countDocuments((err,cuenta) => {
            if (err) {
                return next(err)
            }
            res.render('tasignaciones',{
                asg,
                actual:pagina,
                paginas: Math.ceil(cuenta/porpagina)
            })
        })
        
    })
})

router.get('/delete/:id', (req, res) => {
    Asignaciones.findByIdAndDelete({ _id: req.params.id }, function (err) {
        if (err) {
            console.log("hubo un error")
        }
        req.flash('mensaje', 'has eliminado una Asignacion de tu lista')
        res.redirect('/asignaciones');
    })
})
module.exports= router