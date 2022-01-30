const mongoose = require('mongoose')
const keys = require('./keys/local.json')

mongoose.connect(keys.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(db => console.log('[DB] Se ha conectado a mongodb'))
.catch(err => console.log(`[DB] Ha ocurrido un error: ${err}`))