const aedes = require('aedes')()
const ws = require('websocket-stream')
const httpServer = require('http').createServer()
const mqtt_server = require('net').createServer(aedes.handle)
ws.createServer({ server: httpServer }, aedes.handle)
const mqtt_port = 1883
const ws_port = 8888
const start_mqtt = () => {
    mqtt_server.listen(mqtt_port, function () {
        console.log('server started and listening on port ', mqtt_port)
    })
    httpServer.listen(ws_port, function () {
        console.log('websocket server listening on port ', ws_port)
    })
}
start_mqtt();