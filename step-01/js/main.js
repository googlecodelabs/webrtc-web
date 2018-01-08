'use strict';

// Define navigator.mediaDevices.getUserMedia() for older devices.

/**
 * Constraints to apply to MediaStream.
 * On this codelab, you will be streaming video, but not audio.
 */
const mediaStreamConstraints = {
  audio: false,
  video: true,
};

/** Video element where stream will be placed. */
const localVideo = document.querySelector('video');

/** Handles success by adding the MediaStream to the video element. */
const localMediaStreamSuccessCallback = (mediaStream) => {
  window.localStream = mediaStream;  // Makes stream available to the console.
  if (window.URL) {
    localVideo.src = window.URL.createObjectURL(mediaStream);
  } else {
    localVideo.src = mediaStream;
  }
};

/** Handles error by logging a message to the console with the error message. */
const localMediaStreamErrorCallback = (error) => {
  console.log('navigator.getUserMedia error: ', error);
};

// Initializes media stream.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .then(localMediaStreamSuccessCallback)
  .catch(localMediaStreamErrorCallback);
