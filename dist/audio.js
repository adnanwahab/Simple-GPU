"use strict";
(() => {
  // src/demos/audio.js
  var context;
  var sourceNode;
  var splitter;
  var analyser;
  var javascriptNode;
  function setupAudioNodes() {
    context = new AudioContext();
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    javascriptNode.connect(context.destination);
    javascriptNode.onaudioprocess = function(stuff) {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      getAverageVolume(array);
      const buffer = stuff.outputBuffer;
    };
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;
    sourceNode = context.createBufferSource();
    splitter = context.createChannelSplitter();
    sourceNode.connect(splitter);
    splitter.connect(analyser, 0, 0);
    analyser.connect(javascriptNode);
    sourceNode.connect(context.destination);
  }
  function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
    };
    request.send();
  }
  function getAverageVolume(array) {
    var values = 0;
    var average;
    var length = array.length;
    for (var i = 0; i < length; i++) {
      values += array[i];
    }
    average = values / length;
    return average;
  }
  setupAudioNodes();
  loadSound("https://ia800300.us.archive.org/16/items/JusticeDance/03D.a.n.c.e.mp3");
})();
