const socket = io();
let localStream, peerConnection;

const config = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

window.createRoom = function () {
  const generatedId = Math.random().toString(36).substring(2, 8);
   document.getElementById('roomId').value = generatedId;
  document.getElementById('status').innerText = `Room Created: ${generatedId} (Share this with to login)`;
  setTimeout(() => {
    joinRoom();
  }, 100);
};


window.joinRoom = function () {
  const roomId = document.getElementById('roomId').value;
  if (!roomId) return alert('Enter a room ID');

  document.getElementById('join-screen').style.display = 'none';
  document.getElementById('video-screen').style.display = 'block';
  document.getElementById('room-display').innerText = `Room ID: ${roomId}`;

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localStream = stream;
      document.getElementById('localVideo').srcObject = stream;

      peerConnection = new RTCPeerConnection(config);

      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.ontrack = ({ streams: [remoteStream] }) => {
        document.getElementById('remoteVideo').srcObject = remoteStream;
      };

      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate);
        }
      };

      socket.emit('join-room', roomId);

      socket.on('user-joined', async () => {
        alert('A user has joined the room ');
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer);
      });

      socket.on('offer', async offer => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('answer', answer);
      });

      socket.on('answer', async answer => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on('ice-candidate', async candidate => {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      });

      socket.on('user-left', () => {
        alert('The other user has left the room ');
        document.getElementById('status').innerText = 'User left the room';
      });
    })
    .catch(err => {
      console.error('Failed to access camera/mic:', err);
      alert('Please allow access to your camera and microphone.');
    });
};

