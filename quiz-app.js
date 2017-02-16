// WHAT I LEARNED
// EVENT DELEGATION, CALLBACK FUNCTIONS, USING FILTERS ON JQUERY OBJECTS WITH FIND, SELECTING VARIOUS ELEMENTS IN THE DOM TREE

$(function(){
	var map = {
		"car": "automobile",
		"kid": "small human"	  
	};
	var questionsArray = ["car", "kid"];
	
	//Creating Quiz portion
	var $quizInput = $("#quizInput");	
	var $inputList = $("#inputList");
	var $createQuiz = $("#createQuiz");
	var $newQuestionForm = $("#newQuestionForm");
	var $question = $("#question");
	var $answer = $("#answer");
	var $noInput = $("#no-input");
	
	//Taking Quiz portion
	var $doQuiz = $("#doQuiz");
	var $takeQuiz = $("#takeQuiz");
	var $questionList = $("#questionList");
	
	updateAddingCount();
	
	$newQuestionForm.hide();
	$doQuiz.hide();	
	$createQuiz.show();

		
	$("#createQuizButton").on("click", function(){
		$createQuiz.hide();
		$newQuestionForm.fadeIn("slow");
		$question.focus();
	});
	
	$("#takeQuizButton").on("click", function(){
		$takeQuiz.fadeOut(100);
		$createQuiz.fadeOut(100);		
		$quizInput.fadeOut(100);
		$questionList.fadeOut(100, function(){
			$("#doQuiz").fadeIn("slow");
		});
		$("h1").fadeOut(100, function(){
			$("h1").text("Take your quiz").fadeIn(110);
		});
//		$takeQuiz.hide();
//		$createQuiz.hide();		
//		$quizInput.hide();
//		$questionList.hide();
		$("#doQuiz").fadeIn("slow");
		transferQAndA();
		buildTakeQuiz();
		runQuiz();
	});

		
	function buildTakeQuiz(){
		for(var i = 0; i < questionsArray.length; i++){
			// Wrap every question box with a div
			var $answerDiv = $("<div class=\"answerWrapper\"></div>");
			var $question = $("<p class=\"answerBoxQuestion\">" + questionsArray[i] + "</p>");
			var $form = $("<form class=\"answerForm\"></form>");
			var $input1 = $("<input type=\"text\" class=\"answerBox\" placeholder=\"Answer\">");
			var $input2 = $("<input type=\"submit\" class=\"answerQuestion\" value=\"Check Answer\">");
			var $wrongAnswer = $("<p class=\"wrong-answer\"></p>");
			
			$form.append($input1);
			$form.append($input2);
			$form.append($wrongAnswer);
			
			$answerDiv.append($question);
			$answerDiv.append($form);
			
			$doQuiz.append($answerDiv);
		}
		updateSubtractingCount();
	}
	
	// Driver for the quiz taking
	function runQuiz(){
		var $questionBoxes = $(".answerWrapper");
		$questionBoxes.find(":input.answerBox").first().focus();

		// SHOW ALL OF THE QUESTIONS AND HIDE WHEN THE QUESTION IS COMPLETED
		// OR HIDE AN INCORRECTLY ANSWERED QUESTION AND APPEND IT TO THE END
		$questionBoxes.on("submit", function(e){
			e.preventDefault();
			var $this = $(this);
			$this.focus();
			
			var answerBoxQuestion = $this.find(".answerBoxQuestion").text();
			console.log("Question: " + answerBoxQuestion);
			var $answerBox = $this.find(".answerBox");
			console.log("Answer Attempt: " + $answerBox.val());
			var correctAnswer = map[answerBoxQuestion];
			console.log("Correct Answer: " + correctAnswer);
			if($answerBox.val() === correctAnswer){
				console.log("Right Answer!!");
				$this.remove();
				updateSubtractingCount();
				// Focus on the next question's answer box
				$questionBoxes.find(":input.answerBox").first().focus();
			}else{
				$this.find(".wrong-answer").text("Wrong answer");
				console.log("Wrong answer!!");
				$answerBox.val("");
				$answerBox.focus();
			}
			
			//Removes wrong answer text on keydown
			$this.find(".answerForm").on("keydown", function(){
				$this.find(".wrong-answer").text("");
			});
			
		});

	}
	
	//TODO: FIX SHOW OF THE #DO QUIZ FOR FOCUS

	$newQuestionForm.on("submit", function(e){
		e.preventDefault();
		var noQuestion, noAnswer;
		if(noInputCheck($question)){
			noQuestion = true;
			$noInput.text("No Question Input");
		}
		if(noInputCheck($answer)){
			noAnswer = true;
			$noInput.text("No Answer Input");
		}
		if(noQuestion && noAnswer){
			$noInput.text("No Question and Answer Input");
		}
		if(noQuestion){
			$question.focus();
		}else if(noAnswer){
			$answer.focus();
		}
		if(!noQuestion && !noAnswer){
			var questionText = $question.val();
			var answerText = $answer.val();
			console.log("question: " + questionText + " answer: " + answerText);
			// Display the added question/answer
			$inputList.append("<li><p id=\"questionAdded\">" + questionText + "</p><p id=\"answerAdded\">" + answerText + "</p></li>");
			// Add the key/value pair to the map
			map[questionText] = answerText;
			// Add the question to the questionArray
			questionsArray.push(questionText);
			$question.val("");
			$answer.val("");
			updateAddingCount();
			$question.focus();			
		}
	});
	
	//Removes input error text on keydown
	$newQuestionForm.on("keydown", function(){
		$noInput.text("");
	});
	
	//Returns true for no input, false if there is
	function noInputCheck(form, errorText){
		if(form.val().length === 0){
			return true;
		}
	}
	
		
	// Used when the quiz is being built 
	function updateAddingCount(){
		var count = $inputList.children().length;
		$("#questionCounter").text(count);
	}
		
	// Used when the quiz is being taken
	function updateSubtractingCount(){
		var count = $(".answerWrapper").find(":input.answerBox").length;
		$("#questionsLeftCounter").text(count);		
	}
	
	// Loop through all the li of the inputted list and add them into the question list
	// Possibly can remove this later, but separates the input from the used set
	function transferQAndA(){
		$inputList.children().each(function(){
			$questionList.append($(this));
		});
	}

});
