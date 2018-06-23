var page_num = 1;
var test_count = 0;
var fname;
var lname;
var age;
var record = '';


var es = ["happy", "sad", "angry"];
var vs = ["test.mp4#t=111,4260", "test.mp4#t=862,4260"];
var uris = {};

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

setInterval(function() {
    document.getElementById("time").innerHTML = "Time: "+timestamp();
}, 1000);

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
    fname = document.getElementById("firstname").value;
    lname = document.getElementById("lastname").value;
    age = document.getElementById("age").value;
    var p = document.getElementById("prob").checked;
    if (fname == "") {
    	alert("Please input your first name.");
    } else if (lname === "") {
    	alert("Please input your last name.");
    } else if (age == 0) {
    	alert("Please input your age.");
    } else if (!p) {
    	alert("Please check the box.")
    } else {
        //collect input and set up image capture
        record += fname + ' ' + lname + " (age " + age + ")\n";
    	document.getElementById("user").innerHTML = "User: " + fname + " " + lname + " Age: " + age;
        var i;
        var e_div = document.getElementById("emotions");
        for (i=0; i < es.length; i++) {
            var e = es[i];
            e_div.innerHTML += "<div id=\'"+e+"\' class='column'><button onclick=\"captureEmotion(\'"+e+"\')\">Capture a "+e+" face.</button></div>";
        }
        page_num ++;
    }
};

//hide emojis and play video
function p2() {
    var nPic = Object.keys(uris).length;
    if (nPic == es.length) {
        document.getElementById("emotions").style.display = "none";
        document.getElementById("cam").style.display = "none";
        document.getElementById("tutorial").style.display = "block";
        page_num ++;
    }else{
        alert("Please complete image capturing.");
    }
}

function p3() {
    document.getElementById("tutorialVideo").pause();
    document.getElementById("tutorial").style.display = "none";
    document.getElementById("msg").style.display = "block";
    page_num ++;
}

function p4() {
    document.getElementById("step").style.display = "none";
    var m = document.getElementById("msg");
    m.style.display = "none";
    m.innerHTML = "<h4>Select your response in 3 seconds.</h4>";
    var t = document.getElementById("test");
    var vid = document.getElementById("testVideo");
    var epanel = document.getElementById("emotions");
    timedTest(vid, t, m, epanel);
    setTimeout(function(){
        m.innerHTML = "<h4>Test done.</h4><p>"+record.replace(/\n/g, "<br />")+"<\p>";
        m.style.display = "block";
    }, vs.length*10000);
    //page_num ++;*/
}

function timedTest(vid, t, m, epanel){
    // load and play video
    vid.src = vs[test_count];
    t.style.display = "block";
    record+="test "+test_count+" "+timestamp()+"\n";
    vid.play();
    // after 6 sec, pause and message
    setTimeout(function(){
        vid.pause();
        t.style.display = "none";
        m.style.display = "block";
    }, 6000);
    // after 1 sec, message gone and choose response
    setTimeout(function(){
        //clearSelection();
        m.style.display = "none";
        epanel.style.display = "block";
    }, 7000);
    // after 3 sec, response done and clear
    setTimeout(function(){
        epanel.style.display = "none";
        test_count ++;
        if (test_count < vs.length) {
            timedTest(vid, t, m, epanel);
        }
    }, 10000);
}

function captureEmotion(emotion) {
    record += "capture "+emotion+" "+timestamp()+"\n";
    Webcam.snap(
        function(data_uri) {
            document.getElementById(emotion).innerHTML = '<img src="' + data_uri + '"/><br><input type="radio" name="response" value="'+ emotion + '" id="b'+ emotion + '" onclick="selectEmotion(\''+emotion+'\')">' + emotion + "<br>";
            uris[emotion] = data_uri;
        });
}

function selectEmotion(emotion) {
    record += "select "+emotion+" "+timestamp()+ "\n";
}

