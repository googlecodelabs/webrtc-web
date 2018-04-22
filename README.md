# Realtime communication with WebRTC

This code has the resources you need for the codelab [Realtime communication with WebRTC](https://codelabs.developers.google.com/codelabs/webrtc-web/#0).

This is a work in progress. If you find a mistake or have a suggestion, please [file an issue](https://github.com/googlecodelabs/webrtc-web/issues). Thanks!

## What you'll learn
* Get video from your webcam
* Stream video with RTCPeerConnection
* Stream data with RTCDataChannel
* Set up a signaling service to exchange messages
* Combine peer connection and signaling
* Take a photo and share it via a data channel


## What you'll need
* Chrome 47 or above.
* Web Server for Chrome, or use your own web server of choice.
* The sample code.
* A text editor.
* Basic knowledge of HTML, CSS and JavaScript, Node.JS.


## For 'step-04', 'step-05', 'step-06'

Run `npm install` before running the code.

## Frequently Asked Questions

### Can I use WebRTC in PHP, Python or other backend languages?
Yes. While this Codelab is built using Node.js in order to [enable signaling](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) between peers, [WebRTC](https://webrtc.org) is a web API that can be used in any web server or backend.

There are several repositories on GitHub built in [PHP](https://github.com/search?l=php&q=webrtc&type=Repositories) or [Python](https://github.com/search?l=Python&q=webrtc&type=Repositories) that can help you get started.

### Can I use WebRTC in a server?
Yes. WebRTC is a web API which is intended to be used in a real server. However, note that in order for WebRTC to work, you will need to serve over HTTPs and have your own [signaling system](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/).

### Can this codelab be hosted on a server?
The objective of this codelab is to show and teach how WebRTC works. As a result, the code is not thought or intended to be directly hosted in a server or production environment.

However, you can use the base code to get you started. From there, you would need to get at least the [following relevant changes](https://github.com/googlecodelabs/webrtc-web/issues/70):

1. Migrate from HTTP to HTTPs. [Read more](https://github.com/googlecodelabs/webrtc-web/issues/48).
1. Enabling [signaling using STUN and TURN servers](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) to ensure peers can connect using your service.
1. Rewriting some of the signaling code to ensure that communication only happens across the right peers instead of broadcasting to all connected peers.

### Can we have more than two peers connected using WebRTC?
Yes. The codelab is limitting to two peers per room; but WebRTC can handle multiple connections. [Read more](https://github.com/googlecodelabs/webrtc-web/issues/72).

### Is WebRTC only used for video conferencing?
No, WebRTC can be used for all sorts of Real-Time Communications; including messages or files. You can see more applications on the [WebRTC samples](https://github.com/webrtc/samples).
