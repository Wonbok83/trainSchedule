

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAtREWWUf18JZnsPM4X-mSRLe5FXCimi8U",
  authDomain: "trainschedule-40dbf.firebaseapp.com",
  databaseURL: "https://trainschedule-40dbf.firebaseio.com",
  projectId: "trainschedule-40dbf",
  storageBucket: "trainschedule-40dbf.appspot.com",
  messagingSenderId: "690871412577"
};

firebase.initializeApp(config);


//call firebase datatbase 
var trainDatabase = firebase.database();

//------------------------  create click listener for submit button 
$("#add").on("click", function (event) {

  event.preventDefault();

  //input data 
  trainName = $("#trainName-input").val().trim();
  destination = $("#destination-input").val().trim();
  firstTime = $("#trainTime-input").val();
  frequency = parseInt($("#frequency-input").val().trim());


  //save input data in object 
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency
  };


//push obejct data to firebase
  trainDatabase.ref().push(newTrain);



  //check data is saved in variables
  console.log("train name: " + trainName);
  console.log("destination : " + destination);
  console.log("first time: " + firstTime);
  console.log("frequency: " + frequency);

});//--------------- finish the listener 


// when child is added in firebase 
trainDatabase.ref().on("child_added", function (childSnapshot, prevChildKey) {

  var trainName = childSnapshot.val().trainName;
  var trainDest = childSnapshot.val().destination;
  var trainfirstTime = childSnapshot.val().firstTime;
  var trainFreq = childSnapshot.val().frequency;
//for saving data in new variables for calling out to HTML 

// -- time calculation 

  //input time
  var firstTimeConvert = moment(trainfirstTime, "HH:mm").subtract(1, "years");
  console.log("firstTimeConvert: " + firstTimeConvert);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

//testing which one is bigger 
console.log("firtimeconvert: "+moment(firstTimeConvert).format("X")); 
console.log("currentTime : "+moment(currentTime).format("X"));



  if (moment(firstTimeConvert).format("X") > moment(currentTime).format("X")) {


    //if train time is not passed, then it  
    var nextTrain = moment(firstTimeConvert).format("hh:mm");

  } else {


    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConvert), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);


    // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
    console.log("tRemainder: " + tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


  }


  // put it on HTML 
  var table = $("<tr>");
  var trainNameDisplay = $("<td>").text(trainName);
  var destinationDisplay = $("<td>").text(trainDest);
  var frequencyDisplay = $("<td>").text(trainFreq);
  var nextArrivalDisplay = $("<td>").text(moment(nextTrain).format("HH:mm"));
  var minutesAwayDisplay = $("<td>").text(tMinutesTillTrain);

  table.append(trainNameDisplay, destinationDisplay, frequencyDisplay, nextArrivalDisplay, minutesAwayDisplay);

  $("#train-info").append(table);


  // error handling 
}, function (errorObject) {

  console.log("Error Handled: " + errorObject.code);



});



  // database.orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
  //   var table = $("<tr>");
  //   var trainNameDisplay = $("<th>").text(snapshot.val().trainName);
  //   var destinationDisplay = $("<th>").text(snapshot.val().destination);
  //   var frequencyDisplay = $("<th>").text(snapshot.val().frequency);
  //   var nextArrivalDisplay =$("<th>").text("123");
  //   var minutesAwayDisplay = $("<th>").text("123");
  // });