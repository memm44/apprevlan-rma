const passport = require('passport')
const Usuario = require('../models/usuarios')

exports.postSignup = (req, res, next) => {
    const nuevousuario= new Usuario({
        usuario: req.body.usuario,
        correo: req.body.correo,
        contrasena: req.body.contrasena
    })

    Usuario.findOne({ correo: req.body.correo }, (err, usuarioExistente) => {
        if (usuarioExistente) {
            req.flash('mensaje','error: Este usuario ya existe')
            return res.redirect('/usuarios/login')
        }
        nuevousuario.save((err) => {
            if (err) {
                next(err)
            }
            req.logIn(nuevousuario, (err) => {
                if (err) {
                    next(err)
                }
                req.flash('mensaje','Operación Exitosa! Usuario creado correctamente')
                res.redirect('/')
            })
        })
    })

}
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, usuario, info) => {
        if (err) {
            next(err)
        }
        if (!usuario) {
            // return res.status(400).send('email o contrasena no validos')
            console.log('error! usuario o pass malo')
            req.flash('mensaje','error! usuario o pass malo')
            return res.redirect('/usuarios/login')
            
        }
        req.logIn(usuario, (err) => {

            if (err) {
                next(err)
            }
            req.flash('mensaje','Bienvenido al Sistema: ' +req.user.usuario)
            res.redirect('/')
        })
    })(req, res, next)
}

exports.logout = (req, res) => {
    req.logout()
    req.flash('mensaje','exito! cerraste sesion')

    res.redirect('/usuarios/login')
}