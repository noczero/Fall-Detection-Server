// EXPREES DAN SOCKET IO
const express = require('express'); // import package express
const app = express(); 
const server = require('http').createServer(app);
const io = require('socket.io').listen(server); // import package socket.io
const path = require('path'); // import package path (sudah default ada)

app.use(express.static(path.join(__dirname,'www'))); // untuk nempation file web kita di folder www
const portListen = 1234;
server.listen(portListen);
// /*============================
// =            MQTT            =
// ============================*/
const mqtt = require('mqtt');
const topic = 'fall/zeroDevice-1/ypr'; //subscribe to all topics
const topic2 = 'fall/zeroDevice-1/acc'; //subscribe to all topics
const broker_server = 'mqtt://192.168.1.2';

const options = {
	clientId : 'MyMQTT',
	port : 1883,
	keepalive : 60
}

const clientMqtt = mqtt.connect(broker_server,options);
clientMqtt.on('connect', mqtt_connect);
clientMqtt.on('reconnect', mqtt_reconnect);
clientMqtt.on('error', mqtt_error);
clientMqtt.on('message', mqtt_messageReceived);

function mqtt_connect() {
	clientMqtt.subscribe(topic);
	clientMqtt.subscribe(topic2);
}

function mqtt_reconnect(err){
	//clientMqtt = mqtt.connect(broker_server, options); // reconnect
}

function mqtt_error(err){
	console.log(err);
}

function after_publish() {
	//call after publish
}

let dataDHT22;
function mqtt_messageReceived(topic , message , packet){
	//console.log('Message received : ' + message);
	//console.log('Topic :' + topic);

	let dataKirim = parsingRAWData(message,",");
	if (topic == 'fall/zeroDevice-1/ypr'){
		console.log(dataKirim);
		io.sockets.emit('ypr', {dataypr : dataKirim})
	}
	if (topic == 'fall/zeroDevice-1/acc'){
		console.log(dataKirim);
		io.sockets.emit('acc', {dataAcc : dataKirim})
	}
	//dataDHT22 = JSON.parse(message.toString());
	//io.sockets.emit('dataDHT22' , dataDHT22);
	//console.log(dataDHT22.temperature);
}



// /*=====  End of MQTT  ======*/

// FUNCTION UNTUK PARSING
// argument 1 : data yang diparsing ex: 123 434 5334
// argument 2 : pemisah
// return array data [0] =123 [1] =434 [2] =5334
function parsingRAWData(data,delimiter){
	let result;
	result = data.toString().replace(/(\r\n|\n|\r)/gm,"").split(delimiter);

	return result;
}
