# Interface for Memory Tests

## Usage

This interface is built using node.js. To run the interface, run `server.js` using the following command-line argument:
```
$ node server.js
```
If the code is working, the following line will be outputted and the interface will be served at `localhost:8000`.
```
File server running on port 8000
```

## Documentations

### JQuery and Bootstrap

### Webcams
Two different webcams are used in this interface. 
* [RecordRTC](https://recordrtc.org/) is used for video recording throughout the entire process. 
* [Webcam JS](https://github.com/jhuckaby/webcamjs) is used for creating snapshots to be displayed. 

### Circular layout
[jQuery – arrange items in a circle](http://www.connolly-technologies.com/jquery-arrange-items-in-a-circle/)
is used with parameters adjusted.

## Usage
Add your own `test.mp4` file to use the interface.

To disable the back button of the browser, the multiple pages are organized and fully controlled by the js file.
### Page 1: Basic information
Current version collects the following basic information:
* First name (Required)
* Last name (Required)
* Age (Required)
* Gender
* English level
* Education level
* Memory
* Health condition
* Internet usage
* Video service usage
### Page 2: Facial expressions
A color wheel is displayed with six basic emotions.
### Page 3: Tutorial
Tutorial video is displayed here.

A confirmation message appears before the test starts.
### Test pages
The test runs in the following cycle:

6 seconds of video -> 1 second break -> 3 second emotion selection -> ...

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

## Unsolved Problems
RecordRTC provides a way to post the recorded video through `node.js` in [RecordRTC to Node.js](https://github.com/muaz-khan/RecordRTC/tree/master/RecordRTC-to-Nodejs), but I have not figured out how to implement this feature here.
