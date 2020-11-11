navigator.getUserMedia = 
    navigator.getUserMedia ||
    navigator.webkitGetuserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
let model;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.8,    // confidence threshold for predictions.
}

handTrack.startVideo(video).then( status => {
    if(status){
        navigator.getUserMedia(
            {video:{
                facingMode: 'user'
        }}, 
            stream=>{
                video.srcObject = stream;
                setInterval(runDetection, 1);
            },
            err=> console.log(err)
            );
    }
});

function runDetection(){
    model.detect(video).then(predictions=> {
        console.log(predictions);
        model.renderPredictions(predictions,canvas, context, video);
        // if(predictions.length >0){
        //     audio.play();
        // }
    })
}
handTrack.load(modelParams).then( lmodel=>{
    model= lmodel;
});




const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

const greetings= ['Im here'];
const SpeechRecognition= window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition= new SpeechRecognition();

recognition.onstart = function(){
    console.log('voice is activated, you can to micro');
};

recognition.onresult = function(event){
    console.log(event)
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    readOutLoud(transcript);

}

btn.addEventListener('click', ()=>{
    recognition.start();

});

function readOutLoud(message){
    const speech = new SpeechSynthesisUtterance();
    console.log(message)
if(message.includes('how are you')){
    speech.text = greetings[0];
}

    speech.text = message;
    speech.volume=1;
    speech.rate=1;
    speech.pitch=1;

    window.speechSynthesis.speak(speech); 
}