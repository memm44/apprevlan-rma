const passport=require('passport')
const localStrategy=require('passport-local').Strategy
const Usuario= require('../models/usuarios')
const Casos= require('../models/caso')

passport.serializeUser((usuario,done) => {
    console.log('serializando usario ')
    console.log(usuario);
    done(null,usuario._id)

})
passport.deserializeUser((id,done) => {
    Usuario.findById(id,(err,usuario) => {
        done(err,usuario)
    })
})

passport.use(new localStrategy({
    usernameField:'correo',
    passwordField:'contrasena',
    passReqToCallback:true
},
    (req,correo,contrasena,done) => {
        Usuario.findOne({correo},(err,usuario) => {
            //si no hay usuario en la base de datos
            if (!usuario) {
                return done(null,false, req.flash('mensaje','error! este correo no esta registrado'))
            }else{
                //compara la contrasena con la de la base de datos
                usuario.compararContrasenas(contrasena,(err,sonIguales) => {
                    if (sonIguales) {
                        //si el usuario y clave es correcto
                        return done(null,usuario)
                    }else{
                        //la contrasena es invaliaa
    
                        return done(null,false,req.flash('mensaje','error! contrasena no valida'))
                    }
                })
            }
        })
    }
))

exports.estaAutenticado= (req,res,next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('mensaje','tienes que hacer login')
    res.redirect('/usuarios/login')
}