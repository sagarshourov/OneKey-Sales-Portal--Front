let rec;
let blobs;
let blob;
let stream;

const recorders = {
  mergeAudioStreams(desktopStream, voiceStream) {
    const context = new AudioContext();
    const destination = context.createMediaStreamDestination();
    let hasDesktop = false;
    let hasVoice = false;
    if (desktopStream && desktopStream.getAudioTracks().length > 0) {
      // If you don't want to share Audio from the desktop it should still work with just the voice.
      const source1 = context.createMediaStreamSource(desktopStream);
      const desktopGain = context.createGain();
      desktopGain.gain.value = 0.7;
      source1.connect(desktopGain).connect(destination);
      hasDesktop = true;
    }

    if (voiceStream && voiceStream.getAudioTracks().length > 0) {
      const source2 = context.createMediaStreamSource(voiceStream);
      const voiceGain = context.createGain();
      voiceGain.gain.value = 0.7;
      source2.connect(voiceGain).connect(destination);
      hasVoice = true;
    }
    return hasDesktop || hasVoice ? destination.stream.getAudioTracks() : [];
  },

  async start() {
    let desktopStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    let voiceStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    const tracks = [
      ...desktopStream.getVideoTracks(),
      ...this.mergeAudioStreams(desktopStream, voiceStream),
    ];

    console.log("Tracks to add to stream", tracks);
    stream = new MediaStream(tracks);
    console.log("Stream", stream);

    blobs = [];

    rec = new MediaRecorder(stream, {
      mimeType: "audio/wav; codecs=vp8,opus",
    });
    rec.ondataavailable = (e) => blobs.push(e.data);

    rec.onstop = async () => {
      console.log("on Stop");
      //blobs.push(MediaRecorder.requestData());
      blob = new Blob(blobs, { type: "audio/wav" });
      let url = window.URL.createObjectURL(blob);
      const download = document.getElementById("download");
      console.log("url", url);
      download.href = url;
      download.download = "test.wav";
    };

    rec.start();
  },
  stop() {
    console.log("clicked stop");
    rec.stop();
    stream.getTracks().forEach((s) => s.stop());
    stream = null;
  },
};

export { recorders as recorder };
