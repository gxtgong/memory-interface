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
var fname;
var lname;
var age;
var record = '';


var es = ["happy", "sad", "angry"];
var vs = ["test.mp4#t=111,4260", "test.mp4#t=862,4260"];
var uris = {};

var vidresult = document.getElementById("result-video");

//return a 15-digit number representing current time
function timestamp() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    if (month<10) {month="0"+month;}
    var date = d.getDate();
    if (date<10) {date="0"+date;}
    var minute = d.getMinutes();
    if (minute<10) {minute="0"+minute;}
    var sec = d.getSeconds();
    if (sec<10) {sec="0"+sec;}
    var msec = d.getMilliseconds();
    if (msec<10) {msec="0"+msec;}
    if (msec<100) {msec="0"+msec;}
    return ""+year+month+date+minute+sec+msec;
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
    record += "video start" + timestamp() + "\n";
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

$(document).ready(function() {setCircularPositon(135, 180);});




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
    fname = $("#input-firstname").value;
    lname = $("#input-lastname").value;
    age = +$("#input-age").value;
    if (fname == "") {
    	alert("Please input your first name.");
    } else if (lname === "") {
    	alert("Please input your last name.");
    } else if (age == NaN || age < 1 || age > 100) {
    	alert("Please input your age.");
    } else {  //collect input and set up image capture
        record += fname + ' ' + lname + " (age " + age + ")\n";
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
        $("#step-emo").css("position", "absolute");
        $("#step-emo").css("bottom", 0);
        $("#step-emo").css("right", 500);
        //document.getElementById("btn-happy").onclick = function(){captureEmotionImg("happy");};
        //document.getElementById("btn-sad").onclick = function(){captureEmotionImg("sad");};
        //document.getElementById("btn-angry").onclick = function(){captureEmotionImg("angry");};
        page_num ++;
    }
};

//hide emojis and play video
function p2() {
    /*if ($("#btn-happy").innerHTML != "Recapture"){
        alert("Please capture a happy face.");
    }else if ($("#btn-sad").innerHTML != "Recapture"){
        alert("Please capture a sad face.");
    }else if ($("#btn-angry").innerHTML != "Recapture"){
        alert("Please capture an angry face.");
    }else {
        document.getElementById("div-emotions").classList.add('d-none');
        document.getElementById("btn-happy").onclick = function(){selectEmotion("happy");};
        document.getElementById("btn-happy").innerHTML = "Happy";
        document.getElementById("btn-sad").onclick = function(){selectEmotion("sad");};
        document.getElementById("btn-sad").innerHTML = "Sad";
        document.getElementById("btn-angry").onclick = function(){selectEmotion("angry");};
        document.getElementById("btn-angry").innerHTML = "Angry";
        document.getElementById("div-tutorial").classList.remove('d-none');
        page_num ++;
    }*/
    document.getElementById("div-emotions").classList.add('d-none');
    $("#middleBubble").html('<img src="images/color_wheel_hole.png" height="400" width="400" id="color">');
    $("#color").click(function(e){
        var xPos = e.pageX - $("#color").offset().left;
        var yPos = e.pageY - $("#color").offset().top;
        $("#msg-emo").html("Coordinate: "+xPos+" "+yPos);
        console.log(xPos, yPos);
    });
    setCircularPositon(280, 280);
    document.getElementById("div-tutorial").classList.remove('d-none');
    document.getElementById("step").classList.remove('d-none');
    page_num ++;
}

function p3() {
    document.getElementById("video-tutorial").pause();
    document.getElementById("div-tutorial").classList.add('d-none');
    document.getElementById("msg").classList.remove('d-none');
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
    setTimeout(function(){
        m.innerHTML = "Test done.";
        document.getElementById("p-result").innerHTML = record.replace(/\n/g, "<br />")+"<\p>";
        document.getElementById("p-result").classList.remove('d-none');
        m.classList.remove('d-none');
        document.getElementById("div-result").classList.remove('d-none');
    }, vs.length*10000);
    //page_num ++;*/
}

function timedTest(vid, t, m, epanel){
    // load and play video
    vid.src = vs[test_count];
    t.classList.remove('d-none');
    record+="test "+test_count+" video started "+timestamp()+"\n";
    vid.play();
    // after 6 sec, pause and message
    setTimeout(function(){
        vid.pause();
        t.classList.add('d-none');
        m.classList.remove('d-none');
        record += "test "+test_count+" video stopped "+timestamp()+"\n";
        setTimeout(function(){
            record += "test "+test_count+" selection started "+timestamp()+"\n";
            m.classList.add('d-none');
            epanel.classList.remove('d-none');
            setTimeout(function(){
                epanel.classList.add('d-none');
                record += "test "+test_count+" selection stopped "+timestamp()+"\n";
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
    vidrecorder.stopRecording(function(){
        vidresult.src = vidresult.srcObject = null;
        vidresult.src = URL.createObjectURL(vidrecorder.getBlob());
        vidresult.play();
        vidrecorder.camera.stop();
        vidrecorder.destroy();
        vidrecorder = null;
    });
    document.getElementById("p-result").innerHTML = record.replace(/\n/g, "<br />")+"<\p>";
    document.getElementById("p-result").classList.remove('d-none');
    m.classList.remove('d-none');
    document.getElementById("div-result").classList.remove('d-none');
    document.getElementById("div-p").classList.remove('d-none');
    //vidresult.play();
}


function captureEmotion(emotion) {
    record += emotion + " capture btn clicked " + timestamp() + "\n";
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
    record += emotion + " capture btn clicked " + timestamp() + "\n";
    Webcam.snap( function(data_uri) {
        document.getElementById("face-"+emotion).src = data_uri;
    })
}




function selectEmotion(emotion) {
    record += "select "+emotion+" "+timestamp()+ "\n";
}

