const OpenCamera = require ('./OpenCamera');
const PlayVideo = require('./PlayVideo')
const $ = require('jquery');
const Peer = require('simple-peer');
OpenCamera(function(stream){
  PlayVideo(stream,'localStream')
  const p = new Peer({
          initiator: location.hash === '#1',
          trickle: false,
          stream
        })

        p.on('signal', token => {
          console.log('SIGNAL', JSON.stringify(token))
           $('#txtMySignal').val(JSON.stringify(token))
        });
        p.on('connect', () => {
          console.log('CONNECT')
        })
        $('#btnConnect').click(()=>{
           const fs = JSON.parse($('#txtFriendSignal').val())
           console.log(fs);
           p.signal(fs);
        });
        p.on('stream', friendST => PlayVideo(friendST,'friendStream'))

} );
console.log("xin chao");
