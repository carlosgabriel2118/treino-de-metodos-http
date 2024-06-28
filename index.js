const express = require("express")
const uuid = require("uuid")
const port = 3000
const server = express()
server.use(express.json())

const orders = []

const checkID = (request, response, next) => {
    const {id} = request.params
    const index = orders.findIndex(client => client.id === id)

    if(index < 0){
        return response.status(404).send("order not found")
    }
    request.index = index
    request.clientID = id

    next()
}

const url = (request, response, next) => {
    console.log(`${request.method}/${request.url}`)
    next()
}

server.get("/orders",url, (request, response) =>{
    return response.json(orders)
    
})

server.post("/orders",url, (request, response) =>{
    const {order,nameClient,price} = request.body

    const client = {id:uuid.v4(), order, nameClient, price, status: "Em preparação"}

    orders.push(client)
    return response.status(201).json(client)
})

server.put("/orders/:id",url, checkID, (request, response) => {
    const {order, nameClient, price, status} = request.body
    const index = request.index
    const id = request.clientID


    const clientUp = {id, order, nameClient, price, status}

    orders[index] = clientUp
    
    return response.json(clientUp)
    
})

server.delete("/orders/:id",url, checkID, (request, response) => {
    const index = request.index

    orders.splice(index,1)

    return response.status(204).send("pedido deletado")
})

server.get("/orders/:id", checkID,url, (request, response) =>{
    const index = request.index
    return response.json(orders[index]) 
})

server.patch("/orders/:id", checkID,url, (request, response) => {
    const {status} = request.body
    const index = request.index

    orders[index].status = status

    return response.json(orders[index])
})

server.listen(port, () => {
    console.log('🚀server started')
})