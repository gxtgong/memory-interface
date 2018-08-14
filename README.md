# Interface for Memory Tests

## Usage

Install [node.js](https://nodejs.org/).

Install a node.js module called "formidable" using the following command-line argument.
```
npm install formidable
```
Change line 23 of `home.js` to an array of your own choice of video src's. Blank space is allowed in video names. The variable name `vs` must be kept the same.

For example:
```javascript
var vs = [
    "videodataset/Chrish - Indie girl introduces us to her kitchen (Vine)-8SU0gFPMwP8.mp4", 
    "videodataset/Fresh Like You Do-AeS1MNo5rCs.mp4"
];
```
To run the interface, run `server.js` using the following command-line argument:
```
$ node server.js
```
If the code is working, you will get the following response and the interface will be served at `localhost:8000`.
```
File server running on port 8000
```


## Documentations

### JQuery and Bootstrap

### Webcams
Two different webcams are used in this interface. 
* [RecordRTC](https://recordrtc.org/) is used for video recording throughout the entire process. 
* [Webcam JS](https://github.com/jhuckaby/webcamjs) is used for creating snapshots to be displayed. 

RecordRTC provides a way to access the recorded video through `node.js` in [RecordRTC to Node.js](https://github.com/muaz-khan/RecordRTC/tree/master/RecordRTC-to-Nodejs).

### Circular layout
[jQuery – arrange items in a circle](http://www.connolly-technologies.com/jquery-arrange-items-in-a-circle/)
is rewrited and.

## Process of the test
To disable the back button of the browser, the multiple pages are organized and fully controlled by the js file.
### Page 1: Basic information
Current version collects the following basic information:
* First name
* Last name
* Age
* Gender
* English level
* Education level
* Memory
* Health condition
* Internet usage
* Video service usage

All of the above fields are required except that the last 4 entries are recorded as their default value 6 if the user does not interact with them.
### Page 2: Facial expressions
A color wheel is displayed with six basic emotions.
### Page 3: Tutorial
Tutorial video is displayed here.

A confirmation message appears before the test starts.
### Test pages
The test runs in the following cycle:

6 seconds of video -> 1 second break -> 6 seconds of emotion selection -> ...
#### Subpage 1: Video
The maximum height and width of the video are set to be no greater than the window display. The controls are hidden and the video plays automatically.
#### Subpage 2: Break
A message will appear: "Select your response in 6 seconds."
#### Subpage 3: Emotion selection
A color wheel representing emotion coordinates will appear. As the mouse moves over the wheel, the faces around the wheel will resize accordingly. 

After the mouse clicks somewhere on the wheel, a message will appear: "Press any key to reselect (Coordinate: x y)."


### End page
The json file with all user data is saved under `[MM][DD][Last name][The Initial of first name].json`.
An example would be `0801SmithP.json`:
```json
{
    "startTime": "2018/08/01/23:29:58:493",
    "firstName": "Paul",
    "lastName": "Smith",
    "age": "20",
    "gender": "male",
    "english": "Full professional proficiency",
    "education": "Bachelor's degree",
    "memory": "6",
    "internet": "6",
    "health": "6",
    "youtube": "6",
    "fileName": "0801SmithP",
    "disgust": 1533180623366,
    "surprise": 1533180623865,
    "happy": 1533180624296,
    "sad": 1533180624837,
    "fear": 1533180626618,
    "angry": 1533180627354,
    "test": {
        "0": {
            "videoStart": 1533180633079,
            "coordinate": [
                [
                    199,
                    66
                ]
            ],
            "videoStop": 1533180639082,
            "selectionStart": 1533180640082,
            "selectionStop": 1533180643087
        },
        "1": {
            "videoStart": 1533180643091,
            "coordinate": [
                [
                    309,
                    258
                ]
            ],
            "videoStop": 1533180649092,
            "selectionStart": 1533180650093,
            "selectionStop": 1533180653098
        }
    }
}
```
