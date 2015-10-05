
let audioContext = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext();

export default audioContext;