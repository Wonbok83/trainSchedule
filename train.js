

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
 var trainName = $("#trainName-input").val().trim();
 var destination = $("#destination-input").val().trim();
 var firstTime = $("#trainTime-input").val();
 var frequency = parseInt($("#frequency-input").val().trim());

if(trainName == ""||destination==""||firstTime==""||frequency==0){ alert("Type train information correctly")

}




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

    //for saving data in new variables for calling out to HTML 
  var trainName = childSnapshot.val().trainName;
  var trainDest = childSnapshot.val().destination;
  var trainfirstTime = childSnapshot.val().firstTime;
  var trainFreq = childSnapshot.val().frequency;
  var infoNum = prevChildKey;

console.log("infoNum : " + infoNum);




  // -- time calculation 

  //input time
  var firstTimeConvert = moment(trainfirstTime, "HH:mm").subtract(1, "years"); //go back to yesterday?
  console.log("firstTimeConvert: " + moment(trainfirstTime, "HH:mm")); //UTC 

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));



  //testing which one is bigger     UTC
  console.log("firtimeconvert: " + moment(firstTimeConvert).format("X"));
  console.log("currentTime : " + moment(currentTime).format("X"));



  if (moment(moment(trainfirstTime, "HH:mm")).format("X") > moment(currentTime).format("X")) {

    var futureTime = moment(trainfirstTime, "HH:mm");

    //if train time is not passed, then it  
    var nextTrain = moment(futureTime).format("HH:mm");

    // Minute Until Train
    var tMinutesTillTrain = moment(futureTime).diff(moment(), "minutes");
    

    console.log("ARRIVAL TIME: " + nextTrain);
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
    var xx = moment().add(tMinutesTillTrain, "minutes");

    var nextTrain = moment(xx).format("HH:mm") 

    console.log("ARRIVAL TIME: " + nextTrain);

    console.log("----------------------------------------");

  }


  // put it on HTML 
  var table = $("<tr>");
  var button = $("<button>");

  var trainNameDisplay = $("<td>").text(trainName);
  var destinationDisplay = $("<td>").text(trainDest);
  var frequencyDisplay = $("<td>").text(trainFreq);
  var nextArrivalDisplay = $("<td>").text(nextTrain);
  var minutesAwayDisplay = $("<td>").text(tMinutesTillTrain);
  // var removeDisplay = button.text("remove");

  // button.attr("remove", infoNum);


  table.append(trainNameDisplay, destinationDisplay, frequencyDisplay, nextArrivalDisplay, minutesAwayDisplay);

  $("#train-info").append(table);


  // error handling 
}, function (errorObject) {

  console.log("Error Handled: " + errorObject.code);



});

$("remove").on("click", function(infoNum){

  remove()
  

});




  // database.orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
  //   var table = $("<tr>");
  //   var trainNameDisplay = $("<th>").text(snapshot.val().trainName);
  //   var destinationDisplay = $("<th>").text(snapshot.val().destination);
  //   var frequencyDisplay = $("<th>").text(snapshot.val().frequency);
  //   var nextArrivalDisplay =$("<th>").text("123");
  //   var minutesAwayDisplay = $("<th>").text("123");
  // });