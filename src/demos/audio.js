  var context;
  var audioBuffer;
  var sourceNode;
  var splitter;
  var analyser, analyser2;
  var javascriptNode;

  function setupAudioNodes() {
    context = new AudioContext()
      // setup a javascript node
      javascriptNode = context.createScriptProcessor(2048, 1, 1);
      // connect to destination, else it isn't called
      javascriptNode.connect(context.destination);

      // when the javascript node is called
      // we use information from the analyzer node
      // to draw the volume
      javascriptNode.onaudioprocess = function(stuff) {
          // get the average for the channel
          var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          getAverageVolume(array);
          const buffer = stuff.outputBuffer
    
      }

      // setup a analyzer
      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;

      // create a buffer source node
      sourceNode = context.createBufferSource();
      splitter = context.createChannelSplitter();

      // connect the source to the analyser and the splitter
      sourceNode.connect(splitter);

      // connect one of the outputs from the splitter to
      // the analyser
      splitter.connect(analyser,0,0);

      // connect the splitter to the javascriptnode
      // we use the javascript node to draw at a
      // specific interval.
      analyser.connect(javascriptNode);

      // and connect to destination
      sourceNode.connect(context.destination);
  }

  // load the specified sound
  function loadSound(url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      // When loaded decode the data
      request.onload = function() {

          // decode the data
        //   document.querySelector('body').addEventListener('click', function() {
        //     context.resume().then(() => {
        //       console.log('Playback resumed successfully');
        //     });
        //     context.decodeAudioData(request.response)
        //     .then(function(buffer) {
        //       // when the audio is decoded play the sound

        //       playSound(buffer);
   
        //   })
        // });
      
      }
      request.send();
  }

  function playSound(buffer) {
      sourceNode.buffer = buffer;
      sourceNode.start(0);

         
  }

  // log if an error occurs
  function onError(e) {
      console.log(e);
  }

  function getAverageVolume(array) {
      var values = 0;
      var average;

      var length = array.length;
      // get all the frequency amplitudes
      for (var i = 0; i < length; i++) {
          values += array[i];
      }
      average = values / length;
      return average;
  }

  setupAudioNodes()
  loadSound('https://ia800300.us.archive.org/16/items/JusticeDance/03D.a.n.c.e.mp3')
