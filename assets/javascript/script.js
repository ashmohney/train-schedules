/*
User opens page to see a list of a few trains 
User can add new train to list

Firebase keeps train info 

*/


$( document ).ready(function() {
    console.log( "Ready. Begin countdown." );

   

    //Firebase 
    var config = {
        apiKey: "AIzaSyByEg240RWvptUDCRO53P6EOBUiYzkCcEg",
        authDomain: "trains-sched-b38ef.firebaseapp.com",
        databaseURL: "https://trains-sched-b38ef.firebaseio.com",
        projectId: "trains-sched-b38ef",
        storageBucket: "trains-sched-b38ef.appspot.com",
        messagingSenderId: "549922340375"
    };
    firebase.initializeApp(config);
    const database = firebase.database();


  

let trainName = "";
let destination = "";
let firstTrain = 0;
let frequency = 0;
let currentTime= moment()


        //setting current time
setInterval(function(){
        $("#current-time").html(moment(moment()).format("HH:mm:ss"));
    }, 1000);

        //setting submit button
$("#submit").on("click", function(event) {
  event.preventDefault();


	trainName = $("#trainName").val().trim();

	destination = $("#destination").val().trim();

	firstTrain = $("#firstTrain").val().trim();

	frequency = $("#frequency").val().trim();

        // Clears all of the text-boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");




        //pushes to firebase
  database.ref("/trains").push({

	    trainName: trainName,
	    destination: destination,
	    firstTrain: firstTrain,
	    frequency: frequency

	});
});

 

database.ref("/trains").on("child_added", function(snapshot) {


        //adding moment
	let firstTimeConverted = moment(snapshot.val().firstTrain, "HH:mm").subtract(1, "days");

 	let timeDiff = moment().diff(moment(firstTimeConverted), "minutes");


    let remainder = timeDiff % snapshot.val().frequency;
  

    let minsUntilTrain = snapshot.val().frequency - remainder;


    let nextTrainTime = moment().add(minsUntilTrain, "minutes");
  
  		

    $("#schedule > tbody").append("<tr><td>" + snapshot.val().trainName + "</td><td>" + snapshot.val().destination + "</td><td>" +
        snapshot.val().frequency + "</td><td>" + moment(nextTrainTime).format("HH:mm") + "</td><td>" + minsUntilTrain + "</td></tr>");

	     // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);

});



});