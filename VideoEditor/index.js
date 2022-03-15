/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//                     Quick Video                         //
//   Made by: Jaden Cappelletti and Jarret Whitehouse      //
//                                                         //
//                     Description:                        //
//         Video editing extension which takes input       //
//         from user's camera and microphone and then      //
//         allows for small editing changes. Once          //
//         finished, video can be exported.                //
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

window.onbeforeunload = function (e) {
    return "Please click 'Stay on this Page' if you did this unintentionally";
};

const mediaSelector = document.getElementById("media");
  
const webCamContainer =
    document.getElementById("web-cam-container");
  
let selectedMedia = null;
  
// This array stores the recorded media data
let chunks = [];

  
// Handler function to handle the "change" event
// when the user selects some option
mediaSelector.addEventListener("change", (e) => {
  
    // Takes the current value of the mediaSeletor
    selectedMedia = e.target.value;
  
    document.getElementById(
        `${selectedMedia}-recorder`)
            .style.display = "block";
  
    document.getElementById(
            `${otherRecorderContainer(
            selectedMedia)}-recorder`)
        .style.display = "none";
});
  
function otherRecorderContainer(
    selectedMedia) {
  
    return selectedMedia === "vid" ? 
        "aud" : "vid";
}
  

const audioMediaConstraints = {
    audio: true,
    video: false,
};

const videoMediaConstraints = {
    
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    aspectRatio: { ideal: 1.7777777778 },
    audio: true,
    video: true,
    
};

// HOTKEYS
let counter = 0;

function dockeyUp(e) {
    if (counter == 0 && e.key === ' ') {
        counter = 1;
        startRecording(
        document.getElementById('start-vid-recording'),
        document.getElementById('stop-vid-recording'),
        document.getElementById('pause-vid-recording'),
        document.getElementById('resume-vid-recording'));
    } 
    
    else if (counter == 1 && e.key === ' ') {
        counter = 0;
        stopRecording(
            document.getElementById('stop-vid-recording'),
            document.getElementById('pause-vid-recording'),
            document.getElementById('resume-vid-recording'),
            document.getElementById('start-vid-recording'));
    }

    else if (e.key === 'p') {
        pauseRecording(
            document.getElementById('pause-vid-recording'),
            document.getElementById('stop-vid-recording'),
            document.getElementById('resume-vid-recording'),
        );
    }

    else if (e.key === 'r') {
        resumeRecording(
            document.getElementById('resume-vid-recording'),
            document.getElementById('stop-vid-recording'),
            document.getElementById('pause-vid-recording'),
        );
    }
}

document.addEventListener('keyup', dockeyUp, false);
  
function startRecording(
    thisButton, stopButton, pauseButton, resumeButton) {
  
    // Access the camera and microphone
    navigator.mediaDevices.getUserMedia({
       video: videoMediaConstraints,
       audio: audioMediaConstraints
    }).then((mediaStream) => {
  
        // Create a new MediaRecorder instance
        const mediaRecorder = 
            new MediaRecorder(mediaStream);
  
        //Make the mediaStream global
        window.mediaStream = mediaStream;
        //Make the mediaRecorder global
        window.mediaRecorder = mediaRecorder;
  
        mediaRecorder.start();
  
        mediaRecorder.ondataavailable = (e) => {
  
            // Push the recorded media data to
            // the chunks array
            chunks.push(e.data);
        };
  
        // When the MediaRecorder stops
        // recording, it emits "stop"
        // event
        mediaRecorder.onstop = () => {
  
            const blob = new Blob(
                chunks, {
                    type: selectedMedia === "vid" ?
                        "video/mp4" : "audio/mpeg"
                });
            chunks = [];
  
            // Create a video or audio element
            // that stores the recorded media
            const recordedMedia = document.createElement(
                selectedMedia === "vid" ? "video" : "audio");
            recordedMedia.controls = true;
  
            
            const recordedMediaURL = URL.createObjectURL(blob);
  
            recordedMedia.src = recordedMediaURL;
  
            const downloadButton = document.createElement("a");
  
            downloadButton.download = "Recorded-Media";
  
            downloadButton.href = recordedMediaURL;
            downloadButton.innerText = "Download it!";
  
            downloadButton.onclick = () => {
  
                URL.revokeObjectURL(recordedMedia);
            };
  
            document.getElementById(
                `${selectedMedia}-recorder`).append(
                recordedMedia, downloadButton);
        };
  
        if (selectedMedia === "vid") {
  
            webCamContainer.srcObject = mediaStream;
        }
  
        document.getElementById(
                `${selectedMedia}-record-status`)
                .innerText = "Recording";
  
        thisButton.disabled = true;
        stopButton.disabled = false;
        pauseButton.disabled = false;
        resumeButton.disabled = false;
    });
}
  
function stopRecording(thisButton, pauseButton, resumeButton, recordButton) {
  
    // Stop the recording
    window.mediaRecorder.stop();
  
    // Stop all the tracks in the 
    // received media stream
    window.mediaStream.getTracks()
    .forEach((track) => {
        track.stop();
    });
  
    document.getElementById(
            `${selectedMedia}-record-status`)
            .innerText = "Recording done!";
    thisButton.disabled = true;
    pauseButton.disabled = true;
    resumeButton.disabled = true;
    recordButton.disabled = false;

}

function pauseRecording(thisButton, stopButton, resumeButton) {
    
    window.mediaRecorder.pause();
    
    document.getElementById(
            `${selectedMedia}-record-status`)
            .innerText = "Recording Paused!";

    thisButton.disabled = true;
    stopButton.disabled = false;
    resumeButton.disabled = false;

}

function resumeRecording(thisButton, stopButton, pauseButton) {
    
    window.mediaRecorder.resume();
    
    document.getElementById(
            `${selectedMedia}-record-status`)
            .innerText = "Recording resumed!";

    thisButton.disabled = true;
    stopButton.disabled = false;
    pauseButton.disabled = false;

    
}

