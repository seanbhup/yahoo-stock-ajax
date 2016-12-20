// -------------GLOBALS---------------
const freshDeck = createDeck();
var theDeck = freshDeck;
var playersHand = [];
var dealersHand = [];
// var topOfDeck = 4;

$(document).ready(function(){

	$(".deal-button").click(function(){
		// DEAL STUFF GOES IN HERE
		// console.log(theDeck);
		shuffleDeck();

		playersHand.push(theDeck.shift()); //shifts the first item in an array and returns that element
		dealersHand.push(theDeck.shift()); //basically taking the top card (most recent) in the deck and putting it in a spot
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());

		// playersHand.push(theDeck[0]);
		// dealersHand.push(theDeck[1]);
		// playersHand.push(theDeck[2]);
		// dealersHand.push(theDeck[3]);

		placeCard(playersHand[0], "player", "1");
		placeCard(playersHand[1], "player", "2");
		placeCard(dealersHand[0], "dealer", "1");
		placeCard(dealersHand[1], "dealer", "2");

		calculateTotal("player",playersHand);
		calculateTotal("dealer",dealersHand);

		// ---MAKES DEAL BUTTON DISAPPEAR ON CLICK----
		var whatToDo = $(this).attr("toDo");
		if(whatToDo == "hide"){
			$("#deal").hide("slow");
		}
		// 	------------------------------------------
	});

	$(".hit-button").click(function(){
		// HIT STUFF GOES IN HERE
		if(calculateTotal("player", playersHand) <= 21){
			playersHand.push(theDeck.shift()); //SHIFT AGAIN
			var slotForNewCard = "";
			if(playersHand.length - 1 == 2){
				slotForNewCard = "3"
			}else if(playersHand.length - 1 == 3){
				slotForNewCard = "4"
			}else if(playersHand.length - 1 == 4){
				slotForNewCard = "5"
			}else if(playersHand.length - 1 == 5){
				slotForNewCard = "6"
			}
			var lastCardIndex = playersHand.length - 1;
			// playersHand.push(theDeck[4]);
			placeCard(playersHand[lastCardIndex], "player", slotForNewCard);
			calculateTotal("player",playersHand);
		}
		// -----------------------------
		// playersHand.push(theDeck[4]);
		// playersHand.push(theDeck[5]);
		// playersHand.push(theDeck[6]);
		// playersHand.push(theDeck[7]);
		// // calculateTotal("player",playersHand);
		// placeCard(playersHand[2], "player", "three");
		// $(".hit-button").click(function(){
		// 	placeCard(playersHand[3], "player", "four");
		// 	$(".hit-button").click(function(){
		// 		placeCard(playersHand[4], "player", "five");
		// 		$(".hit-button").click(function(){
		// 			placeCard(playersHand[5], "player", "six");
		// 		})
		// 	})
		// })
		// -----------------------------
		
	});

	$(".stand-button").click(function(){
		dealerTotal = calculateTotal("dealer", dealersHand);
		while(dealerTotal < 17){
			dealersHand.push(theDeck.shift()); //SHIFT AGAIN
			var slotForNewCard = dealersHand.length;
			var lastCardIndex = dealersHand.length - 1;
			// var slotForNewCard = "";
			// if(dealersHand.length - 1 == 2){
			// 	slotForNewCard = "3"
			// }else if(dealersHand.length - 1 == 3){
			// 	slotForNewCard = "4"
			// }else if(dealersHand.length - 1 == 4){
			// 	slotForNewCard = "5"
			// }else if(dealersHand.length - 1 == 5){
			// 	slotForNewCard = "6"
			// }
						// playersHand.push(theDeck[4]);
			placeCard(dealersHand[lastCardIndex], "dealer", slotForNewCard);
			calculateTotal("dealer",dealersHand);
			checkwin();	
		};
	});

});

function checkWin(){
	var dealerTotal = (calculateTotal("dealer", dealersHand))
	var playerTotal = (calculateTotal("player", playersHand))

	if(playerTotal > 21){
		// PUT SOME MESSAGE IN THE DOM
	}else if(dealerTotal > 21){
		// Player Safe dealer busts put message in dom
	}else{
		if(playerTotal > dealerTotal){
			$(".title").text("PLAYER WINS")
		}else if(dealerTotal > playerTotal){
			// DEALER WON PUT IN DOM
		}else{
			// TIE (PUSH) PUT IN DOM
		}
	}
}

function reset(){
	// the deck needs to reset
	theDeck = freshDeck;
	// the player and dealer hands need to be reset
	playersHand = [];
	dealersHand = [];
// 	reset the DOM
// 	-cards
	$(".card").html("");
// 	-totals
	$(".dealer-total-number").html("0");
	$(".player-total-number").html("0");

}

function createDeck(){
	var newDeck = [];
	var suits = ["h", "s", "d", "c"];
	// SUITS/OUTER LOOP
	for(let s = 0; s < suits.length; s++){
		// CARD VALUE/INNER LOOP
		for(let c = 1; c <= 13; c++){
			newDeck.push(c + suits[s])
		}
	}
	return newDeck;
};

function shuffleDeck(){
	for(let i = 0; i < 1000; i++){
		var card1ToSwitch = Math.floor(Math.random() * theDeck.length);
		var card2ToSwitch = Math.floor(Math.random() * theDeck.length);
		var temp = theDeck[card1ToSwitch];
		theDeck[card1ToSwitch] = theDeck[card2ToSwitch];
		theDeck[card2ToSwitch] = temp;
	}
	// console.log(theDeck);
};	

function placeCard(whatCard, who, whichSlot){
	var classToTarget = "." + who + "-cards .card-" + whichSlot;
	// console.log(classToTarget);
	$(classToTarget).html('<img src="images/' + whatCard + '.png">');

};

function calculateTotal(who, hand){
	var total = 0;
	var cardValue = 0;
	var classToTarget = "." + who + "-total-number";
	var hasAce = false;
	for(let i = 0; i < hand.length; i++){
		cardValue = Number(hand[i].slice(0,-1));
		// console.log(cardValue);
		if(cardValue >= 10){
			cardValue = 10;
		}
		if(cardValue === 1){
			hasAce = true;
			cardValue = 11;
		}
		total += cardValue;
		}
	if((total > 21) && (hasAce)){
			total -= 10;
	}
	// if((total < 21) && (hasAce)){
	// 	$(".player-total-value").text()
	// }
	if(total > 21){
		$(classToTarget).text("BUST!")
		$(".title").text("BUST!!!")
	}else{
		$(classToTarget).text(total)
	}
	return total;
	
	
};