

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

var trainDatabase = firebase.database();













//------------------------ 
$("#add").on("click", function (event) {

  event.preventDefault();


  trainName = $("#trainName-input").val().trim();
  destination = $("#destination-input").val().trim();
  firstTime = $("#trainTime-input").val();
  frequency = parseInt($("#frequency-input").val().trim());

  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency
  };



  trainDatabase.ref().push(newTrain);

  console.log("train name: " + trainName);
  console.log("destination : " + destination);
  console.log("first time: " + firstTime);
  console.log("frequency: " + frequency);

});
//------------------------

trainDatabase.ref().on("child_added", function (childSnapshot, prevChildKey) {
  var trainName = childSnapshot.val().trainName;
  var trainDest = childSnapshot.val().destination;
  var trainfirstTime = childSnapshot.val().firstTime;
  var trainFreq = childSnapshot.val().frequency;


  var firstTimeConvert = moment(trainfirstTime, "HH:mm").subtract(1, "years");
  console.log("firstTimeConvert: " + firstTimeConvert);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  if (moment(firstTimeConvert).format("X") > moment(currentTime).format("X")) {

    var nextTrain = moment(firstTimeConvert).add(trainFreq, "minutes");

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

  var table = $("<tr>");
  var trainNameDisplay = $("<td>").text(trainName);
  var destinationDisplay = $("<td>").text(trainDest);
  var frequencyDisplay = $("<td>").text(trainFreq);
  var nextArrivalDisplay = $("<td>").text(moment(nextTrain).format("HH:mm"));
  var minutesAwayDisplay = $("<td>").text(tMinutesTillTrain);

  table.append(trainNameDisplay, destinationDisplay, frequencyDisplay, nextArrivalDisplay, minutesAwayDisplay);

  $("#train-info").append(table);


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