'use strict';

// Set up media stream constant and parameters.

// On this codelab, you will be streaming video only (video: true).
const mediaStreamConstraints = {
  video: true,
};

// Set up to exchange only video.
const offerOptions = {
  offerToReceiveVideo: 1,
};

// Defines initial start time of the call (defined as connection between peers).
let startTime = null;

// Define peer connections, streams and video elements.
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let remoteStream;

let localPeerConnection;
let remotePeerConnection;


// Define MediaStreams callbacks.

// Handles success by adding the MediaStream to the video element.
const gotLocalMediaStream = (mediaStream) => {
  localVideo.srcObject = mediaStream;
  localStream = mediaStream;
  trace('Received local stream.');
  callButton.disabled = false;  // Enable call button.
};

// Handles error by logging a message to the console with the error message.
const localMediaStreamError = (error) => {
  trace(`navigator.getUserMedia error: ${error.toString()}.`);
};

// Handles remote MediaSteam success by...
const gotRemoteMediaStream = (event) => {
  const mediaStream = event.stream;
  remoteVideo.srcObject = mediaStream;
  remoteStream = mediaStream;
  trace('Remote peer connection received remote stream.');
};


// Add behavior for video streams.

// Logs a message with the id and size of a video element.
const logVideoLoaded = (event) => {
  const video = event.target;
  trace(`${video.id} videoWidth: ${video.videoWidth}px, ` +
        `videoHeight: ${video.videoHeight}px.`);
};

// Logs a message with the id and size of a video element.
const logResizedVideo = (event) => {
  logVideoLoaded(event);  // Log size of video by calling logVideoLoaded.

  // First on-resize is used as an indication that video started playing out.
  if (startTime) {  // If startTime is defined is first load.
    const elapsedTime = window.performance.now() - startTime;
    startTime = null;
    trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
  }
};

localVideo.addEventListener('loadedmetadata', logVideoLoaded);
remoteVideo.addEventListener('loadedmetadata', logVideoLoaded);
remoteVideo.addEventListener('onresize', logResizedVideo);


// Define RTC peer connection behavior.

// Connects with new peer candidate.
const connectionHandler = (event) => {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(peerConnection);

    otherPeer.addIceCandidate(newIceCandidate)
      .then(() => { connectionSucceeded(peerConnection); })
      .catch((error) => { connectionFailed(peerConnection, error); });

    trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
          `${event.candidate.candidate}.`);
  }
};

// Logs that the connection succeeded.
const connectionSucceeded = (peerConnection) => {
  trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
};

// Logs that the connection failed.
const connectionFailed = (peerConnection, error) => {
  trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
        `${error.toString()}.`);
}

// Logs changes to the connection state.
const connectionChanged = (event) => {
  const peerConnection = event.target;
  console.log('ICE state change event: ', event);
  trace(`${getPeerName(peerConnection)} ICE state: ` +
        `${peerConnection.iceConnectionState}.`);
};

// Logs error when setting session description fails.
const setSessionDescriptionError = (error) => {
  trace(`Failed to create session description: ${error.toString()}.`);
};

// Logs success when setting session description.
const setDescriptionSuccess = (peerConnection, functionName) => {
  const peerName = getPeerName(peerConnection);
  trace(`${peerName} ${functionName} complete.`);
}

// Short-hand for setDescriptionSuccess when using setLocalDescription.
const setLocalDescriptionSuccess = (peerConnection) => {
  setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

// Short-hand for setDescriptionSuccess when using setLocalDescription.
const setRemoteDescriptionSuccess = (peerConnection) => {
  setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

// Logs offer creation and sets peer connection session descriptions.
const offerCreated = (description) => {
  trace(`Offer from localPeerConnection:\n${description.sdp}`);

  trace('localPeerConnection setLocalDescription start.');
  localPeerConnection.setLocalDescription(description)
    .then(() => { setLocalDescriptionSuccess(localPeerConnection); })
    .catch(setSessionDescriptionError);

  trace('remotePeerConnection setRemoteDescription start.');
  remotePeerConnection.setRemoteDescription(description)
    .then(() => { setRemoteDescriptionSuccess(remotePeerConnection); })
    .catch(setSessionDescriptionError);

  trace('remotePeerConnection createAnswer start.');
  remotePeerConnection.createAnswer()
    .then(answerCreated)
    .catch(setSessionDescriptionError);
};

// Logs answer to offer creation and sets peer connection session descriptions.
// Complementary function of offerCreated.
const answerCreated = (description) => {
  trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

  trace('remotePeerConnection setLocalDescription start.');
  remotePeerConnection.setLocalDescription(description)
    .then(() => { setLocalDescriptionSuccess(remotePeerConnection); })
    .catch(setSessionDescriptionError);

  trace('localPeerConnection setRemoteDescription start.');
  localPeerConnection.setRemoteDescription(description)
    .then(() => { setRemoteDescriptionSuccess(localPeerConnection); })
    .catch(setSessionDescriptionError);
};


// Define and add behavior to buttons.

// Define action buttons.
const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');

// Set up initial action buttons status: disable call and hangup.
callButton.disabled = true;
hangupButton.disabled = true;


// Handles start button action: creates local MediaStream.
const startAction = () => {
  startButton.disabled = true;
  navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream).catch(localMediaStreamError);
  trace('Requesting local stream.');
};

// Handles call button action: creates peer connection.
const callAction = () => {
  callButton.disabled = true;
  hangupButton.disabled = false;

  trace('Starting call.');
  startTime = window.performance.now();

  // Get local media stream tracks.
  const videoTracks = localStream.getVideoTracks();
  const audioTracks = localStream.getAudioTracks();
  if (videoTracks.length > 0) {
    trace(`Using video device: ${videoTracks[0].label}.`);
  }
  if (audioTracks.length > 0) {
    trace(`Using audio device: ${audioTracks[0].label}.`);
  }

  const servers = null;  // Allows for RTC server configuration.

  // Create peer connections and add behavior.
  localPeerConnection = new RTCPeerConnection(servers);
  trace('Created local peer connection object localPeerConnection.');

  localPeerConnection.addEventListener('icecandidate', connectionHandler);
  localPeerConnection.addEventListener(
    'iceconnectionstatechange', connectionChanged);

  remotePeerConnection = new RTCPeerConnection(servers);
  trace('Created remote peer connection object remotePeerConnection.');

  remotePeerConnection.addEventListener('icecandidate', connectionHandler);
  remotePeerConnection.addEventListener(
    'iceconnectionstatechange', connectionChanged);
  remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

  // Add local stream to connection and create offer to connect.
  localPeerConnection.addStream(localStream);
  trace('Added local stream to localPeerConnection.');

  trace('localPeerConnection createOffer start.');
  localPeerConnection.createOffer(offerOptions)
    .then(offerCreated).catch(setSessionDescriptionError);
};

// End up call by closing connections and resetting peers.
const hangupAction = () => {
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
  trace('Ending call.');
};

// Add functionality to buttons.
startButton.addEventListener('click', startAction);
callButton.addEventListener('click', callAction);
hangupButton.addEventListener('click', hangupAction);


// Define helper functions.

// Gets the opposite peer connection.
const getOtherPeer = (peerConnection) => {
  return (peerConnection === localPeerConnection) ?
      remotePeerConnection : localPeerConnection;
};

// Gets the name of a certain peer connection.
const getPeerName = (peerConnection) => {
  return (peerConnection === localPeerConnection) ?
      'localPeerConnection' : 'remotePeerConnection';
};

// Logs an action (text) and the time when it happened on the console.
const trace = (text) => {
  text = text.trim();
  const now = (window.performance.now() / 1000).toFixed(3);

  console.log(now, text);
};
