const express = require('express');
const {Server}=require('socket.io');
const PetManager = require('./Manager/PetManager.js');

const PORT= 8080;
const app = express();
const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
const io = new Server(server);
app.use(express.static(__dirname+'/public'))

//services
const petService = new PetManager();
io.on('connection',async socket=>{
    console.log("cliente conectado");
    let pets = await petService.getAll();
    io.emit('petLog',pets)
    socket.on('sendPet', async data=>{
        await petService.add(data);
        let pets = await petService.getAll();
        io.emit('petLog',pets)
    })
})

//chatBox
let log = [];
io.on('connection', async socket=>{
    socket.broadcast.emit('newUser')

    socket.on('message',async data=>{
        log.push(data);
        io.emit('log',log);
    })
    socket.on('registered',data=>{
        socket.emit('log',log);
    })
})