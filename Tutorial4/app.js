import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { moviesRouter } from './routes/movies.js'

//import movies from './movies.json' // <-- ESTO NO ES VÁLIDO
//import movies from './movies.json' with { type: 'json' } // <-- Ahora mismo esta no la soporta

// Esta es una forma para leer un json en ESModules
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// como leer un json en ESModules recomendado por ahora

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log("server listening on port http://localhost:1234")
})