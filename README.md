# Interface for Memory Tests

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

To disable the back button of the browser, the multiple pages are organized and fully controlled by the js file as the following.
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

6 seconds of video -> 1 second break -> 3 second emotion selection ->...
