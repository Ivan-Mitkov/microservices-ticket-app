import nats from 'node-nats-streaming'
//create client
//in docs is frequently called stan but it's in effect client
const stan =nats.connect('ticketing','abc',{
  url:'http://localhost:4222'
})

//listen to the connect event
stan.on('connect',()=>{
  console.log('Publisher connected to NATS')
})