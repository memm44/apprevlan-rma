const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const path = require('path')
const session = require('express-session')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const passport= require('passport')
const mongoose = require('mongoose')
const flash= require('connect-flash')

const MongoStore = require('connect-mongo')(session)
const urlmongo = 'mongodb://localhost/crud-mongo'
  
  


//conectando la base de datos***************************************************************************
//mongoose.Promise= global.Promise
mongoose.set('useCreateIndex', true)
mongoose.connect(urlmongo, { useNewUrlParser: true })
    .then(db => console.log('DB conectada'))
    .catch(err => console.log(err))
    require('./models/usuarios');
    require('./models/caso');
//importando rutas ************************************************
const indexroutes = require('./routes/index')
const asrouter = require('./routes/r-asignaciones')
const userroutes = require('./routes/r-usuarios')
const actroutes = require('./routes/r-actividades')
const artrouter = require('./routes/r-articulos')
const desktoproutes= require('./routes/r-desktop')
const dvrroutes = require('./routes/r-dvr')
const monitorroutes = require('./routes/r-monitor')
const hojastockroutes = require('./routes/r-hojastock')
//configuraciones
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


//middlewares********************************************************************

app.use(favicon(path.join(__dirname, 'public/img', 'home.png')))
app.use(morgan('dev'))
app.use(bodyparser.urlencoded({ extended: false }))
app.use(session({
    secret: 'miguel2018',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
        url: urlmongo,
        autoReconnect: true
    })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// app.all('/',function(req,res){
//     req.flash('mensaje','funcionooooo')
//     res.redirect('/prueba')
    
// });

// rutas
app.use('/', indexroutes)
app.use('/monitor',monitorroutes)
app.use('/actdiarias', actroutes)
app.use('/usuarios', userroutes)
app.use('/desktops',desktoproutes)  
app.use('/asignaciones',asrouter) 
app.use('/dvr',dvrroutes)  
app.use('/hojastock',hojastockroutes)
app.use('/articulos', artrouter)   


app.use('/usuarios', express.static(__dirname + '/public'));
app.use('/editar', express.static(__dirname + '/public'));
app.use('/finalizados', express.static(__dirname + '/public'));
app.use('/finalizados/:id', express.static(__dirname + '/public'));
app.use('/editar/:id', express.static(__dirname + '/public'));
app.use('/articulos/editararticulos', express.static(__dirname + '/public'));
app.use('/tcasos', express.static(__dirname + '/public'));
app.use('/articulos/editararticulos/:id', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'))
app.use('/actdiarias/tactividades', express.static(__dirname + '/public'));
app.use('/desktops', express.static(__dirname + '/public')); 
app.use('/desktops/tdesktops', express.static(__dirname + '/public')); 
app.use('/dvr/tdvrs', express.static(__dirname + '/public')); 
app.use('/desktops/editar', express.static(__dirname + '/public')); 
app.use('/actdiarias', express.static(__dirname + '/public')); 
app.use('/actdiarias/editar', express.static(__dirname + '/public')); 
app.use('/dvr', express.static(__dirname + '/public')); 
app.use('/dvr/editar', express.static(__dirname + '/public')); 
app.use('/asignaciones', express.static(__dirname + '/public')); 
app.use('/asignaciones/editar', express.static(__dirname + '/public')); 
app.use('/monitor', express.static(__dirname + '/public')); 
app.use('/monitor/tactividades', express.static(__dirname + '/public')); 
app.use('/asignaciones/tasignaciones', express.static(__dirname + '/public'));
app.use('/monitor/usuarioact', express.static(__dirname + '/public'));
app.use('/monitor/hojastock', express.static(__dirname + '/public'));
app.use('/hojastock/editararthoja', express.static(__dirname + '/public'));
app.use('/hojastock/addart', express.static(__dirname + '/public'));
app.use('/hojastock/thojas', express.static(__dirname + '/public'));
app.use('/hojastock', express.static(__dirname + '/public'));
app.use('/hojastock/detalle', express.static(__dirname + '/public'));
app.use('/hojastock/editarhoja', express.static(__dirname + '/public'));
app.use(function(req, res, next) {
    
    return res.status(404).render('404');
  });
//iniciando servidor****************************************************************

app.listen(3000, () => {
    console.log(`Servidor en Puerto ${app.get('port')}`)

});