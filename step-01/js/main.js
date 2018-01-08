'use strict';

/**
 * On this codelab, you will be streaming only video (true).
 * Constraints to apply to MediaStream.
 */
const mediaStreamConstraints = {
  video: true,
};

/** Video element where stream will be placed. */
const localVideo = document.querySelector('video');

/** Handles success by adding the MediaStream to the video element. */
const gotLocalMediaStream = (mediaStream) => {
  video.srcObject = mediaStream;
};

/** Handles error by logging a message to the console with the error message. */
const localMediaStreamError = (error) => {
  console.log('navigator.getUserMedia error: ', error);
};

// Initializes media stream.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .then(gotLocalMediaStream).catch(localMediaStreamError);
