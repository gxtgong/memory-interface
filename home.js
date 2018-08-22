// Webcam set up
function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(camera) {
        callback(camera);
    }).catch(function(error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
}

// Global variables

var gifrecorder;
var vidrecorder;

var page_num = 1;
var test_count = 0;
var record = '';

var userData = {};

//change this to your own video srcs
var vs = ["videodataset/Chrish - Indie girl introduces us to her kitchen (Vine)-8SU0gFPMwP8.mp4", "videodataset/Fresh Like You Do-AeS1MNo5rCs.mp4"];
var uris = {};

var vidresult = document.getElementById("result-video");

//return a 15-digit number representing current time
function timestamp(raw=false) {
    var d = new Date();

    if (raw) {
        return d.getTime();
    }
    
    var year = d.getFullYear()+"/";
    var month = d.getMonth()+1;
    if (month<10) {month="0"+month;}
    month += "/";
    var date = d.getDate();
    if (date<10) {date="0"+date;}
    date += "/";
    var hour = d.getHours();
    if (hour<10) {hour="0"+hour;}
    hour += ":";
    var minute = d.getMinutes();
    if (minute<10) {minute="0"+minute;}
    minute += ":";
    var sec = d.getSeconds();
    if (sec<10) {sec="0"+sec;}
    sec += ":";
    var msec = d.getMilliseconds();
    if (msec<10) {msec="0"+msec;}
    if (msec<100) {msec="0"+msec;}
    return year+month+date+hour+minute+sec+msec;
}

$(document).ready(function(){
    captureCamera(function(camera) {
        setSrcObject(camera, vidresult);
        //vidresult.play();
        vidrecorder = RecordRTC(camera, {
            type: 'video',
            width: 1280,
            height: 720
        });
        vidrecorder.startRecording();
        vidrecorder.camera = camera;
    });
    userData.startTime = timestamp();
    $("#vid-emo").css("left", ($(window).width() - $("#vid-emo").width())/2);
    //setCircularPosition("#vid-emo");
});

function setCircularPosition(centerID) {
    //Arrange the icons in a circle centered in the div
    numItems = $( ".img-circle" ).length; //How many items are in the circle?
    start = 0; //the angle to put the first image at. a number between 0 and 2pi
    step = (2*Math.PI)/numItems; //calculate the amount of space to put between the items.
    //Now loop through the buttons and position them in a circle
    var centerR = Math.max($(centerID).height(), $(centerID).width())/2;
    var centerX = $(centerID).position().left + centerR;
    var centerY = $(centerID).position().top + centerR;
    $( ".img-circle" ).each(function( index ) {
        //console.log(this.getAttribute('id'));
        rimR = $(this).height();
        radius = centerR + rimR; 
        relativeX = radius * Math.cos(start);
        relativeY = radius * Math.sin(start);
        rleft = centerX+relativeX-rimR/2;
        rtop = centerY+relativeY-rimR/2;
        start += step; //add the "step" number of radians to jump to the next icon
        $(this).css("top",rtop);
        $(this).css("left", rleft);
    });
    // set the position of texts
    $( ".p-text" ).each(function ( index ) {
        // get the corresponding face
        var face = $("#"+this.getAttribute('id').replace('text','face'));
        // offset
        tmpTop = face.position().top - 30;
        tmpLeft =  face.position().left;
        //set the top/left settings for the image
        $(this).css("top",tmpTop);
        $(this).css("left",tmpLeft);
    });
}

function setMouseClick(){
    $("#img-emotion").unbind("click");
    $("#img-emotion").click(function(e){
        xPos = e.pageX - $("#img-emotion").position().left;
        yPos = e.pageY - $("#img-emotion").position().top - 55;
        centerR = $("#img-emotion").height()/2;
        $("#msg-emo").html("Press any key to reselect (Coordinate: "+xPos+" "+yPos+")");
        userData.test[test_count]["coordinate"].unshift([xPos,yPos]);
        $("#img-emotion").unbind("mousemove");
        $("#img-emotion").unbind("click");
        $(document).keydown(function(e){
            setMouseEffect();
            setMouseClick();
            $(document).unbind("keydown");
        });
    });
}

function setMouseEffect() {
    $("#img-emotion").mousemove(function(e){
        xPos = e.pageX - $("#img-emotion").position().left;
        yPos = e.pageY - $("#img-emotion").position().top - 55;
        centerR = $("#img-emotion").height()/2;
        if (distance(xPos,yPos,centerR, centerR) < centerR){
            $("#msg-emo").html("Coordinate: "+xPos+" "+yPos);
            a = 2*centerR;
            b = centerR;
            //console.log(xPos, yPos);
            start = 0;
            step = (2*Math.PI)/6;
            numItems = $( ".img-circle" ).length;
            $( ".img-circle" ).each(function( index ) {
                a = centerR + centerR*Math.cos(start);
                b = centerR + centerR*Math.sin(start);
                start += step;
                d = distance(xPos,yPos,a,b);
                size = 20 + 80 * Math.pow(1 - d/(2*centerR), 2);
                //console.log("    FROM " + a + " " + b);
                //console.log("    DISTANCE " + d);
                //console.log("    SCALED SIZE " + size);
                $(this).css("height", size);
                $(this).css("width", size);
            });
            setCircularPosition("#img-emotion");
        }
    });
}

function distance(x,y,a,b){
    return Math.sqrt((x-a)*(x-a)+(y-b)*(y-b));
}





function nextpage() {
    if (page_num == 1) {
        p1();
    }else if (page_num == 2) {
        p2();
    }else if (page_num == 3) {
        p3();
    }else if (page_num == 4) {
        p4();
    }else{}
}

//collect basic info
function p1() {
    var input = document.getElementById("userinput");
    console.log(input.checkValidity());
    if (input.reportValidity()) {
        //collect input and set up image capture
        userData.firstName = input.elements[0].value;
        userData.lastName = input.elements[1].value;
        userData.age = input.elements[2].value;
        userData.gender = input.elements[3].value;
        userData.english = input.elements[4].value;
        userData.education = input.elements[5].value;
        userData.memory = input.elements[6].value;
        userData.internet = input.elements[7].value;
        userData.health = input.elements[8].value;
        userData.youtube = input.elements[9].value;
        userData.fileName = userData.startTime.substring(5, 10).replace("/","") + userData.lastName + userData.firstName[0];
        console.log("INPUT "+ JSON.stringify(userData, null, 4));
        //remove previous page
        document.getElementById("userinput").classList.add('d-none');
        document.getElementById("step").classList.add('d-none');
        document.getElementById("div-emotions").classList.remove('d-none');
        $( ".img-circle" ).each(function(){
            $(this).click(function(){captureEmotionImg(this.getAttribute('id').replace("face-", ""));});
        });
        $("#step-emo").click(function(){nextpage();});
        setCircularPosition("#vid-emo");
        page_num ++;
    }else{
    }
};

//hide emojis and play video
function p2() {
    var emotionArray = ['happy', 'sad', 'angry', 'fear', 'disgust', 'surprise']
    var completed = emotionArray.filter(function(emotion){
        return userData.hasOwnProperty(emotion);
    });
    if (completed.length == 6) {
        document.getElementById("div-emotions").classList.add('d-none');
        var temp = document.getElementById("divCircle");
        temp.removeChild(temp.childNodes[1]);
        //document.getElementById("vid-emo").classList.add('d-none');
        document.getElementById("step-emo").classList.add('d-none');
        $("#step-emo").unbind("click");

        document.getElementById("img-emotion").classList.remove('d-none');
        document.getElementById("msg-emo").innerHTML = "Select an emotion coordinate.";
        $( ".img-circle" ).each(function(){
            $(this).unbind("click");
        });
        Webcam.reset();
        userData.test = {};
        
        
        document.getElementById("div-tutorial").classList.remove('d-none');
        document.getElementById("step").classList.remove('d-none');
        page_num ++;
    } else {
        alert("Please complete all captures.");
    }
}

function p3() {
    document.getElementById("video-tutorial").pause();
    document.getElementById("div-tutorial").classList.add('d-none');
    document.getElementById("msg").classList.remove('d-none');
    document.getElementById("msg").style.marginTop = "100px";
    document.getElementById("msg").style.marginBottom = "10px";
    page_num ++;
}

function p4() {
    document.getElementById("step").classList.add('d-none');
    //document.getElementById("div-bar").classList.remove('d-none');
    var t = document.getElementById("div-test");
    var vid = document.getElementById("video-test");
    var epanel = document.getElementById("div-emotions");
    var m = document.getElementById("msg");
    m.classList.add('d-none');
    m.innerHTML = "Select your response in 6 seconds.";
    timedTest(vid, t, m, epanel);
}

function timedTest(vid, t, m, epanel){
    // load and play video
    vid.src = vs[test_count];
    t.classList.remove('d-none');
    userData.test[test_count] = {"videoStart": timestamp(true)};
    userData.test[test_count]["coordinate"] = [];
    vid.play();
    // after 6 sec, pause and message
    setTimeout(function(){
        vid.pause();
        t.classList.add('d-none');
        m.classList.remove('d-none');
        userData.test[test_count]["videoStop"] = timestamp(true);
        //document.getElementById('bar-time').style.width = '0%';
        setTimeout(function(){
            /*function countDown() {
                document.getElementById('bar-time').style.width = parseInt(100*currentWidth) + '%';
                currentWidth += widthStep;
                setTimeout(function(){
                    if (currentWidth < 1) {
                        countDown();
                    }else{
                        document.getElementById('bar-time').style.width = '100%';
                    }
                }, 100);
            }
            var widthStep = 120/6000;
            var currentWidth = 0;
            countDown();*/

            userData.test[test_count]["selectionStart"] = timestamp(true);
            m.classList.add('d-none');
            epanel.classList.remove('d-none');
            
            $("#img-emotion").css("left", ($(window).width() - $("#img-emotion").width())/2);
            $( ".img-circle" ).each(function(){
                $(this).css({"height":"100px", "width":"100px"});
            });
            setCircularPosition("#img-emotion");
            setMouseEffect();
            setMouseClick();

            $("#step-emo").removeClass('d-none');
            $("#step-emo").unbind("click");
            $("#step-emo").click(function(){
                epanel.classList.add('d-none');
                document.getElementById("msg-emo").innerHTML = "Select an emotion coordinate.";
                userData.test[test_count]["selectionStop"] = timestamp(true);
                test_count ++;
                if (test_count < vs.length) {
                    timedTest(vid, t, m, epanel);
                }else{
                    endTest(m);
                }
            });

            
        }, 1000); // break time
    }, 6000); // video time
}

function endTest(m){
    m.innerHTML = "Test done.";
    vidrecorder.stopRecording(function(){
        vidresult.src = vidresult.srcObject = null;
        vidresult.src = URL.createObjectURL(vidrecorder.getBlob());
        vidresult.play();
        vidrecorder.camera.stop();
        //vidrecorder.destroy();
        //vidrecorder = null;
        //postFiles();
    });
    //document.getElementById("p-result").innerHTML = "saved";//JSON.stringify(userData, null, 4).replace(/\n/g, "<br />");
    //document.getElementById("p-result").classList.remove('d-none');
    m.classList.remove('d-none');
    document.getElementById("div-result").classList.remove('d-none');
    document.getElementById("div-p").classList.remove('d-none');
    $("#save-result").click(function(){
        vidrecorder.save(userData['fileName']+'.webm');
    })
    $.post(userData.fileName+'.json', JSON.stringify(userData, null, 4), function(data, status){
        if (status == "success") {
            $('#presult-json').html('Data successfully saved under '+userData['fileName']+'.json');
            postFiles();
        }
    });
}

function captureEmotionImg(emotion) {
    userData[emotion] = timestamp(true);
    Webcam.snap( function(data_uri) {
        document.getElementById("face-"+emotion).src = data_uri;
    })
}


// post video
function postFiles() {
    var blob = vidrecorder.getBlob();
    // getting unique identifier for the file name
    var fileName = userData['fileName'] + '.webm';

    var file = new File([blob], fileName, {
        type: 'video/webm'
    });
    xhr('/uploadFile', file, function(responseText) { //??
        var fileURL = JSON.parse(responseText).fileURL;
        $('#presult-video').html('Video successfully saved under '+fileName);
    });
}

// XHR2/FormData
function xhr(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };
    request.open('POST', url);
    var formData = new FormData();
    formData.append('file', data);
    request.send(formData);
}
