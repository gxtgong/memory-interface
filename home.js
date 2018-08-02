// Webcam set up
function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(camera) {
        callback(camera);
    }).catch(function(error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
}


/*function stopRecordingCallback() {
    document.getElementById('tempmsg').innerHTML = 'Gif recording stopped: ' + bytesToSize(recorder.getBlob().size);
    image.src = URL.createObjectURL(recorder.getBlob());
    recorder.camera.stop();
    recorder.destroy();
    recorder = null;
}*/

// Global variables

var gifrecorder;
var vidrecorder;

var page_num = 1;
var test_count = 0;
var record = '';

var userData = {};




var es = ["happy", "sad", "angry"];
var vs = ["test.mp4#t=111,4260", "test.mp4#t=862,4260"];
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
    setCircularPositon(135, 180);
});

function setCircularPositon(midH, midW) { //($("#middleBubble").height(), $("#middleBubble").width())
    var divTop = ($("#divCircle").height() - midH)/2;//$($("#divCircle").height() - ("#middleBubble").height())/2;
    var divLeft = ($("#divCircle").width() - midW)/2;//$($("#divCircle").width() - ("#middleBubble").width())/2;
    $("#middleBubble").css("top",divTop + "px");
    $("#middleBubble").css("left",divLeft + "px");
    //Arrange the icons in a circle centered in the div
    numItems = $( ".img-circle" ).length; //How many items are in the circle?
    start = 0; //the angle to put the first image at. a number between 0 and 2pi
    step = (2*Math.PI)/numItems; //calculate the amount of space to put between the items.
    //Now loop through the buttons and position them in a circle
    $( ".img-circle" ).each(function( index ) {
        radius = ($("#divCircle").width() - $(this).width())/2; //The radius is the distance from the center of the div to the middle of an icon
        //the following lines are a standard formula for calculating points on a circle. x = cx + r * cos(a); y = cy + r * sin(a)
        //We have made adjustments because the center of the circle is not at (0,0), but rather the top/left coordinates for the center of the div
        //We also adjust for the fact that we need to know the coordinates for the top-left corner of the image, not for the center of the image.
        tmpTop = (($("#divCircle").height()/2) + radius * Math.sin(start)) - ($(this).height()/2);
        tmpLeft = (($("#divCircle").width()/2) + radius * Math.cos(start)) - ($(this).width()/2);
        start += step; //add the "step" number of radians to jump to the next icon
                 
        //set the top/left settings for the image
        $(this).css("top",tmpTop);
        $(this).css("left",tmpLeft);
    });
    $( ".p-text" ).each(function ( index ) {
        radius = ($("#divCircle").width() - $("#face-happy").width())/2; //The radius is the distance from the center of the div to the middle of an icon
        //the following lines are a standard formula for calculating points on a circle. x = cx + r * cos(a); y = cy + r * sin(a)
        //We have made adjustments because the center of the circle is not at (0,0), but rather the top/left coordinates for the center of the div
        //We also adjust for the fact that we need to know the coordinates for the top-left corner of the image, not for the center of the image.
        tmpTop = (($("#divCircle").height()/2) + radius * Math.sin(start)) - ($("#face-happy").height()/2);
        tmpLeft = (($("#divCircle").width()/2) + radius * Math.cos(start)) - ($("#face-happy").width()/2);
        start += step; //add the "step" number of radians to jump to the next icon

        // offset
        tmpTop += 120;
        tmpLeft += 30;
        //set the top/left settings for the image
        $(this).css("top",tmpTop);
        $(this).css("left",tmpLeft);
    });
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
        $("#face-happy").click(function(){captureEmotionImg("happy");});
        $("#face-sad").click(function(){captureEmotionImg("sad");});
        $("#face-angry").click(function(){captureEmotionImg("angry");});
        $("#face-fear").click(function(){captureEmotionImg("fear");});
        $("#face-disgust").click(function(){captureEmotionImg("disgust");});
        $("#face-surprise").click(function(){captureEmotionImg("surprise");});
        $("#step-emo").click(function(){nextpage();});
        page_num ++;
        //input.classList.add('was-validated');
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
        document.getElementById("step-emo").classList.add('d-none');
        document.getElementById("msg-emo").innerHTML = "Select an emotion coordinate.";
        $("#face-happy").unbind("click");
        $("#face-sad").unbind("click");
        $("#face-angry").unbind("click");
        $("#face-fear").unbind("click");
        $("#face-disgust").unbind("click");
        $("#face-surprise").unbind("click");
        userData.test = {};
        $("#middleBubble").html('<img src="images/color_wheel_hole.png" height="400" width="400" id="color">');
        $("#color").click(function(e){
            var xPos = e.pageX - $("#color").offset().left;
            var yPos = e.pageY - $("#color").offset().top;
            $("#msg-emo").html("Coordinate: "+xPos+" "+yPos);
            console.log(xPos, yPos);
            userData.test[test_count]["coordinate"].unshift([xPos, yPos]);
        });
        setCircularPositon(280, 280);
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
    var t = document.getElementById("div-test");
    var vid = document.getElementById("video-test");
    var epanel = document.getElementById("div-emotions");
    var m = document.getElementById("msg");
    m.classList.add('d-none');
    m.innerHTML = "Select your response in 3 seconds.";
    timedTest(vid, t, m, epanel);
    /*setTimeout(function(){
        m.innerHTML = "Test done.";
        document.getElementById("p-result").innerHTML = record.replace(/\n/g, "<br />")+"<\p>";
        document.getElementById("p-result").classList.remove('d-none');
        m.classList.remove('d-none');
        document.getElementById("div-result").classList.remove('d-none');
    }, vs.length*10000);*/
    //page_num ++;*/
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
        setTimeout(function(){
            userData.test[test_count]["selectionStart"] = timestamp(true);
            m.classList.add('d-none');
            epanel.classList.remove('d-none');
            setTimeout(function(){
                epanel.classList.add('d-none');
                document.getElementById("msg-emo").innerHTML = "Select an emotion coordinate.";
                userData.test[test_count]["selectionStop"] = timestamp(true);
                test_count ++;
                if (test_count < vs.length) {
                    timedTest(vid, t, m, epanel);
                }else{
                    endTest(m);
                }
            }, 3000);
        }, 1000);
    }, 6000);
}

function endTest(m){
    m.innerHTML = "Test done.";
    //m.style.marginTop = "0px";
    vidrecorder.stopRecording(function(){
        vidresult.src = vidresult.srcObject = null;
        vidresult.src = URL.createObjectURL(vidrecorder.getBlob());
        vidresult.play();
        vidrecorder.camera.stop();
        vidrecorder.destroy();
        vidrecorder = null;
    });
    document.getElementById("p-result").innerHTML = "saved";//JSON.stringify(userData, null, 4).replace(/\n/g, "<br />");
    document.getElementById("p-result").classList.remove('d-none');
    m.classList.remove('d-none');
    document.getElementById("div-result").classList.remove('d-none');
    document.getElementById("div-p").classList.remove('d-none');
    $.post(userData.fileName+'.json', JSON.stringify(userData, null, 4), function(data, status){
        console.log("Data: "+ data + " Status: " + status);
    });
    //vidresult.play();
}


function captureEmotion(emotion) {
    userData.emotion = timestamp(true);
    var btn = document.getElementById("btn-"+emotion);
    var img = document.getElementById("img-"+emotion);
    document.getElementById("btn-happy").disabled = true;
    document.getElementById("btn-sad").disabled = true;
    document.getElementById("btn-angry").disabled = true;
    captureCamera(function(camera) {
        btn.innerHTML = 'Waiting to start recording';
        gifrecorder = RecordRTC(camera, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
                record += emotion + " capture started " + timestamp() + "\n";
                btn.innerHTML = 'Recording started';
                btn.classList.remove("btn-outline-primary");
                btn.classList.add("btn-danger");
            },
            onGifPreview: function(gifURL) {
                img.src = gifURL;
            }
        });
        gifrecorder.startRecording();
        gifrecorder.camera = camera;
        setTimeout(function(){
            gifrecorder.stopRecording(function(){
                img.src = URL.createObjectURL(gifrecorder.getBlob());
                gifrecorder.camera.stop();
                gifrecorder.destroy();
                gifrecorder = null;
                document.getElementById("btn-happy").disabled = false;
                document.getElementById("btn-sad").disabled = false;
                document.getElementById("btn-angry").disabled = false;
                btn.innerHTML = "Recapture";
                btn.classList.remove("btn-danger");
                btn.classList.add("btn-outline-primary");
            });
        }, 3000);
    });
}

function captureEmotionImg(emotion) {
    userData[emotion] = timestamp(true);
    Webcam.snap( function(data_uri) {
        document.getElementById("face-"+emotion).src = data_uri;
    })
}




function selectEmotion(emotion) {
    record += "select "+emotion+" "+timestamp()+ "\n";
}

