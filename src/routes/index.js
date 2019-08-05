const express = require('express')
const router = express.Router();
const Actividad = require('../models/actividad')
const Caso = require('../models/caso')
const Reg = require('../models/paprueba')
const Usuario = require('../models/usuarios')
const Articulo =  require('../models/articulo')
const moment = require('moment')
const Hojastock = require('../models/hojastock')

const mongoose = require('mongoose')

var autenticar = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('mensaje', 'Debes iniciar sesion!')
    res.redirect('/usuarios/login')

}
router.get('*', (req, res, next) => {
    usuario = req.user
    pagActiva = req.url
    console.log('esta es pag activa'+pagActiva)
    
    next()
})
router.get('/articulos', autenticar, (req, res) => {

    Caso.find({ encargado: req.user._id })
        .then((total_art) => {

            console.log("ARTICULOS OBTENIDOS CON EXITO")
            res.render('articulos', {
                total_art
            })
        })
        .catch((err) => {
            console.log('ocurrio un error ' + String(err))
        })


})
router.post('/casos/add', async (req, res) => {
    
    const caso = new Caso({
        tienda:{
            codigo:req.body.desc_tienda,
            nombre:req.body.desc_tienda
        } ,
        fechaIngCT:req.body.fechaingct,
        fechaIng:req.body.fechahoy,
        articulos: [{
            codigo: req.body.cod_art,
            descripcion: req.body.desc_art,
            nserie: req.body.nserie,
            nfact: req.body.nfactura,
            reporte: req.body.desc_reporte,
            facturacionCTienda:{
                codigo: req.body.ctfact|| '',
                valor: req.body.valctfact || 0,
            },
            facturacionCmejia:{
                codigo: req.body.cmfact|| '',
                valor: req.body.valcmfact || 0,
            },
            transferencias:req.body.transferencias,
            
        }],
        ncaso: {
            numcaso:req.body.ncaso,
            codigocaso:req.body.desc_tienda+'-'+req.body.ncaso
        },
        cliente:{
            nombre:req.body.nombcliente,
            apellido:req.body.apcliente,
            direccion:req.body.dircliente,
            telefonos:req.body.telfcliente
        },
        encargado: req.user._id,
        tipo_caso: req.body.tipo_caso,
        rep_final: '',
        
    })
    console.log(caso)
    await caso.save()
    
     
    req.flash('mensaje', 'Caso guardado con exito para ' + req.user.usuario)
    res.redirect('/')
})
router.post('/articulos/add', (req, res) => {
    const nuevo= new Articulo({
        usuario: req.user._id,
        codigo: req.body.codigo,
        descripcion: req.body.descripcion,
        nserie:req.body.serie,
        nfact: req.body.nfac,
        reporte: req.body.rep,
        facturacionCTienda:{
            codigo: req.body.ctfact|| '',
                valor: req.body.valctfact || 0,
        },
        facturacionCMejia:{
            codigo1: req.body.cmfact|| '',
            valor1: req.body.valcmfact || 0,
        },
        transferencias:req.body.transferencias,
        
        guiaSE:req.body.guiast || ''
    })
    nuevo.save().
    then((guardado) => {
        console.log(guardado)
        res.send('guardado correctamente')
    })
    

})

router.post('/editar/:id', async (req, res) => {

    const { id } = req.params
    const result= await Caso.findOneAndUpdate({ _id: id }, {
        tienda:{
            codigo:req.body.desc_tienda,
            nombre:req.body.desc_tienda
        } ,
        fechaIngCT:req.body.fechaingct,
        ncaso: {
            numcaso:req.body.ncaso,
            codigocaso:req.body.desc_tienda+'-'+req.body.ncaso
        },
        facturacionCTienda:{
            codigo: req.body.ctfact|| '',
            valor: req.body.valctfact || 0,
        },
        facturacionCmejia:{
            codigo: req.body.dfact|| '',
            valor: req.body.valfact || 0,
        },
        transferencias:req.body.transferencias,
        cliente:{
            nombre:req.body.nombcliente,
            apellido:req.body.apcliente,
            direccion:req.body.dircliente,
            telefonos:req.body.telfcliente
        },
        status:{
            titulo:req.body.statustitulo,
            descripcion:req.body.statusdescripcion || "sin descripcion"
        },
        encargado: req.user._id,
        tipo_caso: req.body.tipo_caso,
        rep_final: req.body.repfinal,
        envio:{
            guia:req.body.guiase,
            fechaEnv:req.body.fechaenv
        }
    })
    console.log('actualizado'+result)
    req.flash('mensaje', 'Actualizado Correctamente')
    res.redirect('/')
})


router.get('/p', (req, res) => {
    req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1
    res.send(`hola has visto esta pagina : ${req.session.cuenta}`)
});
router.get('/finalizados', (req, res) => {

    Caso.find({ encargado: req.user._id, "status.titulo":'finalizado'})
    
        .then((casos) => {
            console.log(casos)
            res.render('finalizados', {
                casos, mensaje: req.flash('mensaje')
            })
        })
})
router.get('/pendientes',async(req, res) => {
    const casostock = await Hojastock.find({encargado:req.user._id})
    Usuario.populate(casostock,  {path:"encargado"}, function (err,casostock) {
       
       Caso.find({encargado:req.user._id})
   .exec((err,caso) => {
    if (err) {
        return res.status(500).send(err)
    }
     Usuario.populate(caso,  {path:"encargado"}, function (err,caso) {
        res.status(200).render('pendientes', {caso,casostock})
       })
     })
   })
})

router.get('/finalizados/:id', async (req, res) => {
    const { id } = req.params
    const caso = await Caso.findById(id)
    res.render('reptecnicodetalle', {
        repselec: caso, mensaje: req.flash('mensaje')
    })
})
router.get('/reportes', async (req, res) => {
    Caso.find({ encargado: req.user._id, rep_final:/./})
    
        .then((casos) => {
            console.log(casos)
            res.render('reportes', {
                casos, mensaje: req.flash('mensaje')
            })
        })
})

router.get('/', autenticar, async (req, res) => {
   
    var fecha_actual = moment().format('YYYY-MM-DD')
    console.log(`esta es la fecha actual ${fecha_actual}`);
    Caso.aggregate([ {
        $project: {_id: 1, count: {$size: '$articulos'}}
    }]).then((resultado) => {
        console.log(resultado[0].count)
    })
    .catch((err) => {
        console.log(err)
    })
    Caso.find({ encargado: req.user._id ,fechaIng:fecha_actual}).sort({creado:-1})
        .then((total_casos) => {

            console.log("obtenidos con exito")
            res.render('index', {
                casos: total_casos, 
                mensaje: req.flash('mensaje'),
                mensajebad:req.flash('mensajebad')
            })
        })
        .catch((err) => {
            console.log('ocurrio un error ' + String(err))
        })


})
router.get('/json/:codigo', (req,res) => {
    const {codigo}= req.params
    Caso.findOne({"ncaso.codigocaso":codigo}, function (err,caso_especifico) {
        if (err) {
            res.status(500).json('hubo un error')
        }
        if (caso_especifico===null) {
           Hojastock.findOne({"codigocaso":codigo},(err,caso_especifico) => {
            if (err) {
                res.status(500).json('hubo un error')
            }
            Usuario.populate(caso_especifico,{path:"encargado"},function (err,caso_especifico) {
                res.status(200).json(caso_especifico)
                
            })
           })
        }else{
        Usuario.populate(caso_especifico,{path:"encargado"},function (err,caso_especifico) {
            res.status(200).json(caso_especifico)
            
        })
    }
    })

  
})
router.post('/buscar', (req,res) => {
    const codcaso= req.body.codcaso
    Caso.find({'ncaso.codigocaso':codcaso}, (err,caso) => {
        if (err) {
            return console.log('error')
        }
        console.clear()
        console.log('encontraste la fecha'+caso)
        res.render('caso_filtrado',{caso, mensaje:req.flash('mensaje')})
        
    })
    
})

router.get('/tcasos/:pagina', (req,res) => {
    let porpagina = 20
    let pagina = req.params.pagina || 1

    Caso.
    find({})
    .sort({creado:-1})
    .skip((porpagina*pagina)-porpagina)
    .limit(porpagina)
    .exec((err,casos) => {
        Caso.countDocuments((err,cuenta) => {
            if (err) {
                return next(err)
            }
            res.render('tcasos',{
                casos,
                actual:pagina,
                paginas: Math.ceil(cuenta/porpagina)
            })
        })
        
    })
})

router.get('/casos', async (req, res) => {
    res.render('casos')
})


router.get('/delete/:id', (req, res) => {
    Caso.findByIdAndDelete({ _id: req.params.id }, function (err) {
        if (err) {
            console.log("hubo un error")
        }
        req.flash('mensaje', 'has eliminado un caso de tu lista')
        console.log("ELIMINADO")
        res.redirect('/');
    })
})

router.get('/turn/:id', async (req, res) => {
    const { id } = req.params
    const caso = await Caso.findById(id)
    if (caso.status.titulo==="finalizado") {
        caso.status.titulo="revision"
        req.flash('mensaje', 'has reabierto el caaso')
        res.redirect('/')
    
    if (caso.rep_final && caso.status.titulo === 'finalizado') {
        
        req.flash('mensaje', 'caso finalizado')
    }
    else {
        req.flash('mensajebad', 'debes colocar el reporte final del caso especificando la solución y poner status finalizado')

    }
}
    await caso.save()
    res.redirect('/')
})

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params
    const caso = await Caso.findById(id)
    console.log('esta eeeeeeeeeeeeeeeeeeeeeeeeess'+ caso.articulos.length)
    res.render('editar', { caso,mensaje:req.flash('mensaje'),mensajebad: req.flash('mensajebad') })
})
// esta es la seccion donde se guardan y actualizan los articulos




router.get('/prueba', (req, res) => {
    res.render('prueba', { mensaje: req.flash('mensaje') })
})



//exportando para reutilizacion
module.exports = router
