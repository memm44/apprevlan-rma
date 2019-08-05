const express = require('express')
const router = express.Router()
const Usuario = require('../models/usuarios')
const Hojastock = require('../models/hojastock')

const moment = require('moment')

router.get('/', (req,res) => {
   Hojastock.find({encargado:req.user._id})
   .then((todos) => {
      console.log(todos)
      Hojastock.populate(todos,{path:'encargado'}, (err,todos) => {
         if (err) {
            console.log(err)
         }
         res.render('hojastock',{mensaje:req.flash('mensaje'),mensajebad:req.flash('mensaje'),todos})
      })
      
   })
   
})


router.post('/addhoja', (req,res) => {
   const  nuevahoja = new Hojastock({
      encargado:req.user._id,
      fecha:req.body.fechaoculta,
      codigocaso:req.body.codigocaso,
      transferencias:req.body.transferencias

   })
   req.flash('mensaje','guardado correctamente')
   nuevahoja.save()
  res.redirect('/hojastock')
})

router.get('/addart/:id', (req,res) => {
   const {id }= req.params
   Hojastock.findOne({"_id":id}, (err, articulos) => {
      console.log('seleccionaste '+articulos)
      res.render('hojastock_add',{articulos, mensaje:req.flash('mensaje')})
   })
})
router.post('/addart', (req,res) => {
   const id= req.body.id
   Hojastock.updateOne({_id:id},{
      $addToSet:{articulo:{
         codigo:req.body.codigoart,
         descripcion:req.body.descripcion,
         cantidad_items:req.body.cantidad,
         observacion:req.body.observacion,
         completo: req.body.completo,
         bodega_final:req.body.bodega,
      }
   }
},((err,act) => {
   console.log(act)
   req.flash('articulo anadido a la hoja')
   res.redirect(`/hojastock/addart/${id}`)
})) 

      
})

router.get('/eliminar/:id', async (req,res) => {
  
   const { id } = req.params
   const hojaselected = await Hojastock.deleteOne({_id:id} )
   console.log('seleccionada  '+hojaselected )
   req.flash('Hoja eliminada correctamente')
   res.redirect('/hojastock') 
})

router.get('/editararthoja/:id', async (req,res) => {

   const { id } = req.params
   const hojaselected = await Hojastock.findOne({"articulo._id":id},"articulo.$" )
   console.log('seleccionada  '+hojaselected )
   res.render('editar_arthoja', { hojaselected})
})
router.get('/eliminaarthoja/:hid/:aid',(req,res) => {
   const {hid} = req.params
   const{aid} = req.params
   Hojastock.findById({_id:hid})
   .then((articulos) => {
      Hojastock.updateOne({ _id: hid }, {
          $pull: {
              articulo: {
                  _id: aid
              }
          }
      })
      .then(() => {
              req.flash('mensaje', 'Articulo eliminado correctamente')
              res.redirect(`/hojastock`)

      })
   })
})
router.post('/editarhojaart/:hid/:id', (req,res) => {
  
   const { id } = req.params
   const {hid} = req.params
   Hojastock.findById({_id:hid})
   .then((hojas) => {
      Hojastock.updateOne({
         "articulo._id":id}, {$set:{
         
            "articulo.$.codigo":req.body.codigoart,
            "articulo.$.descripcion":req.body.descripcion,
            "articulo.$.cantidad_items":req.body.cantidad,
            "articulo.$.observacion":req.body.observacion,
            "articulo.$.completo": req.body.completo,
            "articulo.$.bodega_final":req.body.bodega,
         }   
       })
       .then(() => {
         req.flash('mensaje','Actualizado correctamente')
         res.redirect(`/hojastock/addart/${hid}`)
       })
       
   })
   
    
})
router.get('/editarhoja/:id', async (req,res) => {
  
   const { id } = req.params
   const hojaselected = await Hojastock.findOne({_id:id} )
   console.log('seleccionada  '+hojaselected )
   res.render('editarhoja', { hojaselected })
})
router.post('/editarhoja/:id', async (req,res) => {
  
   const { id } = req.params
   const hojaselected = await Hojastock.updateOne({_id:id},{
      status:{
         titulo:req.body.status,
         descripcion:req.body.descripcion
      },
      codigocaso:req.body.codigocaso,
      transferencias:req.body.transferencias
   } )
   console.log('actualizado'+hojaselected)
   res.redirect('/hojastock')
})

router.get('/thojas/:pagina', (req,res) => {
   let porpagina = 20
   let pagina = req.params.pagina || 1

   Hojastock.
   find({encargado:req.user._id})

   .skip((porpagina*pagina)-porpagina)
   .limit(porpagina)
   .exec((err,hoja) => {
      Hojastock.populate(hoja,{path:'encargado'}, (err,hoja) => {
         if (err) {
            console.log(err)
         }
      
      Hojastock.countDocuments((err,cuenta) => {
           if (err) {
               return next(err)
           }
           res.render('thojas',{
               hoja,
               actual:pagina,
               paginas: Math.ceil(cuenta/porpagina)
           })
       })
      })
   })
})
router.post('/buscarhoja', async (req,res) => {
   const seriehoja = req.body.busqueda
   
   Hojastock.find({$or:[{codigocaso:seriehoja}]}, (err,todos) => {
         if (err ) {
            console.log('este es el error'+err)
         }
         Hojastock.populate(todos,{path:'encargado'}, (err,todos) => {
            if (err) {
               console.log(err)
            }
            console.clear()
         
         res.render('hojastock2',{todos,mensaje:req.flash('mensaje'),mensajebad:req.flash('mensajebad')})
         })
         
         
      
      
   })
   
})
router.get('/detalle/:idhoja', async (req,res) => {
   const {idhoja} = req.params

   Hojastock.findOne({encargado:req.user._id, _id:idhoja}, (err,articulos) => {
       if (err) {
           return console.log('error')
       }
       console.clear()
       res.render('hoja_especifica',{articulos, mensaje:req.flash('mensaje')})
       
   })
   
})
module.exports= router