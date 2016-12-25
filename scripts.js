// 1. Make getJSON into a function so you can call it whenever you need to.
// 2. Instead of auto saving their symbols, you give them a save button
// 3. Retrieve button?
// 4. Put bookmarks on the side of the page
// 5. Automatically refresh all stocks every X seconds
// 6. Keep the watchlist stocks in a separate table from searched stocks
// 7. Keep a "Recent" localStorage var and a "Saved" localStorage var
// 8. Pair up with BlackJack

$(document).ready(function(){

	$('#arrow1').click(function(){
		$('#page1,#page2,#page3').css({
			"right":"100vw"
		});
	})
	$('#arrow2').click(function(){
		$('#page1,#page2,#page3').css({
			"right":"0vw"
		});
	})
	$('#arrow3').click(function(){
		$('#page1,#page2,#page3').css({
			"right":"200vw"
		});
	})
	$('#arrow4').click(function(){
		$('#page1,#page2,#page3').css({
			"right":"100vw"
		});
	})

	// See if theh user has any stored stocks. If so, then load them
	var userStocksSaved = localStorage.getItem("userStocks");
	// console.log(userStocksSaved);
	// for(let i = 0; i < userStocksSaved.length; i++){
	// 	var htmlToPlot = buildStockRow(userSTocksSaved[i]);
	// 	$('#stock-body').append(htmlToPlot);
	// }

	var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('"+userStocksSaved+"')%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
	$.getJSON(url, function(dataJSGotIfAny){
			var stockInfo = dataJSGotIfAny.query.results.quote;
			if(dataJSGotIfAny.query.count == 1){
				var htmlToPlot = buildStockRow(stockInfo);
				$('#stock-body').append(htmlToPlot);
			}else{
				for (let i = 0; i < stockInfo.length; i++){
					var htmlToPlot = buildStockRow(stockInfo[i]);
					$('#stock-body').append(htmlToPlot);
				}
			}
		});


	$(".yahoo-form").submit(function(){
		// Stop the form from submitting (default action)
		event.preventDefault();
		//Get whatever the user typed out of the input and store it in symbol
		var symbol = $("#symbol").val();
		localStorage.setItem("userStocks", symbol);
		// console.log(symbol);
		// Dynamically build the URL to use the symbol(s) the user requested
		var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('"+symbol+"')%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
		// console.log(url);	
		// getJSON, param1 = where to go, param2 = what to do
		$.getJSON(url, function(dataJSGotIfAny){
			var stockInfo = dataJSGotIfAny.query.results.quote;
			if(dataJSGotIfAny.query.count == 1){
				var htmlToPlot = buildStockRow(stockInfo);
				$('#stock-body').append(htmlToPlot);
			}else{
				for (let i = 0; i < stockInfo.length; i++){
					var htmlToPlot = buildStockRow(stockInfo[i]);
					$('#stock-body').append(htmlToPlot);
				}
			}
		});
			
			// console.log(stockInfo);
		// console.log("Where is JS");
	});


	function buildStockRow(stock){
	if (stock.Change.indexOf('+') > -1) {
       	var classChange = "success";
       	$("#total-cash-value").html("$100");
    }else{
        var classChange = "danger";
        $("#total-cash-value").html("$-100")
    }
       	var newHTML = '';
        newHTML += '<tr>';
            newHTML += '<td><label class="checkbox-inline"><input type="checkbox" id="inlineCheckbox1" value="option">'+stock.Symbol+'</label></td>';
            newHTML += '<td>'+stock.Name+'</td>';
            newHTML += '<td>'+stock.Ask+'</td>';
            newHTML += '<td>'+stock.Bid+'</td>';
            newHTML += '<td class="'+classChange+'">'+stock.Change+'</td>';
            // newHTML += '<td>'+stock.Change+'</td>';
        newHTML += '</tr>';
    return newHTML;
	}

	// ----------BLACKJACK------------
	const freshDeck = createDeck();
var theDeck = freshDeck;
var playersHand = [];
var dealersHand = [];
var dealersOpeningHand = [];


// var firstDeal = true;
// var topOfDeck = 4;

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
		// placeCard(dealersHand[1], "dealer", "2");
		placeCard("deck", "dealer", "2");
		placeCard("deck", "dealer", "3");
		placeCard("deck", "dealer", "4");
		placeCard("deck", "dealer", "5");
		placeCard("deck", "dealer", "6");
		placeCard("deck", "player", "3");
		placeCard("deck", "player", "4");
		placeCard("deck", "player", "5");
		placeCard("deck", "player", "6");


		calculateTotal("player",playersHand);
		dealersOpeningHand.push(dealersHand[0]);
		calculateTotal("dealer",dealersOpeningHand);

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
		var dealerTotal = calculateTotal("dealer", dealersHand);
		placeCard(dealersHand[1], "dealer", "2");
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
			var dealerTotal = calculateTotal("dealer", dealersHand);
		}

		checkWin();
	});

	function checkWin(){
		var dealerTotal = (calculateTotal("dealer", dealersHand))
		var playerTotal = (calculateTotal("player", playersHand))

		if(playerTotal > 21){
			$(".end-game-message").text("Sorry, you lost!")
			$(".end-game").addClass("end-game-animation")
		}else if(dealerTotal > 21){
			$(".end-game-message").text("You won!")
			$(".end-game").addClass("end-game-animation")
		}else{
			if(playerTotal > dealerTotal){
				$(".end-game-message").text("Sorry, y--... Just kidding, YOU WON!")
				$(".end-game").addClass("end-game-animation")
			}else if(dealerTotal > playerTotal){
				$(".end-game-message").text("Sorry, you lost!")
				$(".end-game").addClass("end-game-animation")
			}else{
				$(".end-game-message").text("You pushed with the dealer!")
				$(".end-game").addClass("end-game-animation")
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
		// if((who === "dealer") && (whatCard === dealersHand[1]) && (firstDeal)){
		// 	firstDeal; false
		// 	var classToTarget = "." + who + "-cards .card-" + whichSlot;
		// 	$(classToTarget).html('<img src="images/deck.png">');
		// }else{
			var classToTarget = "." + who + "-cards .card-" + whichSlot;
			// console.log(classToTarget);
			$(classToTarget).html('<img src="images/' + whatCard + '.png">');
		// }

		
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
			$(classToTarget).text("Busted with " + total)
		}else{
			$(classToTarget).text(total)
		}
		return total;
	};

	function totalCash(betAmount, ifWin, currentCash){

	}
	// setTimeout(function(){
 //   	window.location.reload(1);
	// }, 1000);

});


