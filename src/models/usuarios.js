const mongoose = require('mongoose');
const esquema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const Usuario = new esquema({
    usuario: { type: String, required: true },
    correo: { type: String, unique: true, lowercase: true, required: true },
    contrasena: { type: String, required: true }

}, { timestamps: true })

Usuario.pre('save', function (next) {
    usuario = this
    if (!usuario.isModified('contrasena')) {
        return next()
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            next(err)
        }
        console.log('estas es la saaal ' + salt)
        bcrypt.hash(this.contrasena, salt, null, (err, hash) => {
            if (err) {
                next(err)
            }
            this.contrasena = hash
            next()
        })
    })
})
Usuario.methods.compararContrasenas = function (contrasena, cb) {
    bcrypt.compare(contrasena, this.contrasena, (err, sonIguales) => {
        if (err) {
            return cb(err)
        }
        cb(null, sonIguales)
    })
}


module.exports = mongoose.model('usuarios', Usuario)
