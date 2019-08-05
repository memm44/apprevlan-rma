const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarios')
const passport = require('passport')
const passportConfig= require('../config/passport')
const controladorUser= require('../controladores/c-usuarios')
router.get('*',(req,res,next) => {
    // esto hace que se cree una variable usuario para todas las rutas
    
    usuario=req.user
    next()
})
router.get('/login', (req,res) => {
    
    res.render('login',{ mensaje: req.flash('mensaje') })
    
})

router.get('/signup', (req,res) => {
    res.render('signup',{mensaje: req.flash('mensaje') })
    
})
router.get('/', passportConfig.estaAutenticado,(req, res) => {
    Usuario.find()
        .then((usuarios) => {

            res.render('usuarios',{usuarios,usuario:req.user,mensaje: req.flash('mensaje')})
        })
        
})
router.get('/delete/:id', async(req, res) => {
    console.clear()
    const {id} = req.params
    const elimina = await Usuario.findByIdAndDelete({_id:id})
    res.redirect('/usuarios')
            
        
})

router.get('/logout',passportConfig.estaAutenticado,controladorUser.logout)

router.post('/add', controladorUser.postSignup)
router.post('/login' ,controladorUser.postLogin)
router.get('/logout',controladorUser.logout)


    // const usuario = new Usuario({
    //     usuario: req.body.usuario,
    //     correo: req.body.correo,
    //     contrasena: req.body.contrasena

    // })
    // usuario.save()
    //     .then((usuarios) => {
    //         console.log("datos guardos")
    //         console.log(usuarios)
    //         res.redirect('/usuarios')
    //     })
    //     .catch((err) => {
    //         console.log(err)

    //     })




module.exports= router