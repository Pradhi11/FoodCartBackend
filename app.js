import 'dotenv/config'
import { connectDB } from './src/config/connect.js'
import fastify from 'fastify'
import { PORT } from './src/config/config.js'
import fastifySocketIO from 'fastify-socket.io'
import {registerRoutes} from './src/routes/index.js'
import { admin, buildAdminRouter } from './src/config/setup.js'
 
const start = async()=>{
 await connectDB(process.env.MONGO_URI)
 const app = fastify()

 app.register(fastifySocketIO,{
    cors:{

    },
    pingInterval:10000,
    pingTimeout:5000,
    transports:['websocket']
 })

 await registerRoutes(app)
 await buildAdminRouter(app)

 app.listen({port:PORT,host:'0.0.0.0'},(err,addr)=>{
    if(err){
        console.log("Server error")
    }else{
         console.log(`Server Working sucessfully on http://localhost:${PORT}${admin.options.rootPath}`)
    }
 })

 app.ready().then(()=>{
    app.io.on('connection',(socket)=>{
        console.log("A user connected")
         socket.on("joinRoom",(orderId)=>{
            socket.join(orderId);
            console.log(`user joined the room ${orderId}`)
         })

         socket.on("disconnect",(orderId)=>{
            console.log(`user disconnect`)
         })
    })

   
 })
}

start()