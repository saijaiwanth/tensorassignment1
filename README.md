Real-Time Two-Way Video Streaming Web Application using WebRTC
==============================================================

Objective:
----------
Build a real-time two-way live video streaming web application using WebRTC,
where users can join the same "room" via a room ID and stream video & audio
to each other.



Project Structure:
------------------
webrtc-video-app/
├── public/         - Frontend files (HTML, CSS, JS)
│   ├── index.html
│   ├── script.js
│   └── index.css
├── server/         - Express server and socket handling
│   └── server.js

(npm modules shall be installed as we run npm)

Getting Started:
----------------
1. Clone the repository:

   git clone https://github.com/saijaiwanth/tensorassignment1

2. Navigate to the server directory:

   cd tensorassignment1/server/

3. Install dependencies:

   npm install

4. Start the server:

   node server.js

5. Open a browser and go to:

   http://localhost:3000

Usage:
------
- Enter a room ID and click "Join"
- Share the room ID with another user to let them join
- Both users will be able to see and hear each other live

Technologies Used:
------------------
- Node.js
- Express.js
- Socket.io
- WebRTC
- HTML, CSS, JavaScript


