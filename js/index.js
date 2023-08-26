var lvl = 0;
var click_counter = -1;
var basis_pattern = [];
var pressed_pattern = [];
var timer_left = 0;
var game_timer;
let tick_tock = new Audio("sounds/tick-tock.wav");
let is_game_over = true;
let button_pressed = false;



//adds the event when the btns are clicked ...
click_btn("green");
click_btn("red");
click_btn("yellow");
click_btn("blue");

$("#move").on("click", home);

$(".container").hide();

//starts the game when any key is pressed ...
$("body").keypress(function(event) {

    console.log("press","btn press:", button_pressed, "gameover:", is_game_over);

    if(button_pressed == false) {

    
        if(is_game_over && (event.key!= "1" && event.key!="2" && event.key !="3" && event.key!="4")) {

                button_pressed = true;
                setTimeout(reset_game,500);
                //is_game_over = true;

        } else if(is_game_over == false && button_pressed == false) {

            switch(event.key) {
                case "1":
                    $("#green").click();
                    button_pressed = true;
                    break;
                case "2":
                    $("#red").click();
                    button_pressed = true;
                    break;
                case "3":
                    $("#yellow").click();
                    button_pressed = true;
                    break;
                case "4":
                    $("#blue").click();
                    button_pressed = true;
                    break;
                default:

            }

        }

        button_pressed = false;
        
    }
});


function reset_game() {

    if(lvl == 0 && $("#level-title").text() != "Level 1") {
        $("#start_img").hide();
        $(".container").slideDown();
        $("#level-title").text("Level 1");
        $("body").removeClass("game-over");
        $("#end_img").slideUp();
        $("#end_img").hide();
        $("#level-instruction").addClass("display-none");
        $("#timer").removeClass("display-none");
        $("#timer").text("00:00:05")
        $("#timer").removeClass("timer-red");
        $("#timer").addClass("timer-gold");
        $("#move").removeClass("display-none");
        $("#move").removeClass("underline");
        $("#move").text("Buttons left: 1")
        lvl = 1;
        timer_left = 5
        is_game_over = false;
        setTimeout(play, 500);
    }

}

function home() {

    if($("#move").text() == "back to HOME") {

        lvl = 0;
        click_counter = -1;
        basis_pattern = [];
        pressed_pattern = [];
        timer_left = 0;

        is_game_over = true;
        tick_tock.pause();
        clearInterval(game_timer);
        $("#start_img").show();
        $("#end_img").hide();
        $(".container").slideUp();
        $("#level-title").text("Press any key to Start");
        $("body").removeClass("game-over");
        $("#level-instruction").removeClass("display-none");
        $("#timer").addClass("display-none");
        $("#move").addClass("display-none");
    }
}

function play() {
    count_down();
    let random = random_btn();
    play_new_btn(random);  
}

function count_down() {

    clearInterval(game_timer);

    game_timer = setInterval(function() {
        timer_left--;
        $("#timer").text(secondsToTime(timer_left));
        
        if(timer_left <= 5) {
            tick_tock.play();
            $("#timer").removeClass("timer-gold");
            $("#timer").addClass("timer-red");
            
        } else {
            tick_tock.pause();
            $("#timer").removeClass("timer-red");
            $("#timer").addClass("timer-gold");
        }

        if(timer_left <= 0 ) {
            tick_tock.pause();
            new Audio("sounds/wrong.mp3").play();
            clearInterval(game_timer);
            setTimeout(game_over,500);
        }
    },1000) 


}

function random_btn() {
    return Math.floor((Math.random() * 4)) + 1
}

function play_new_btn(random) {

    let color = "";

    switch(random) {
        case 1:
            color = "green";
            break;
        case 2:
            color = "red";
            break;
        case 3:
            color = "yellow";
            break;
        case 4:
            color = "blue";
            break;
        default:
            color = "green";
            break;
    }
    
    basis_pattern.push(color);

    new Audio("sounds/"+color+".mp3").play()
    $("#"+color).fadeOut().fadeIn();

}

function click_btn(color) {
    
    $("#"+color).on("click", function() {
        

        console.log("click","btn press:", button_pressed, "gameover:", is_game_over);
        
        if(is_game_over == false && button_pressed == false){

            button_pressed = true;

            //animates button to look pressed
            $("#"+color).addClass("pressed");
            //returns design of button
            setTimeout(function() { $("#"+color).removeClass("pressed") },100)

            pressed_pattern.push(color);

            click_counter++;

            if (basis_pattern[click_counter] != pressed_pattern[click_counter]) {
                //incorrect answer ...
                //plays the sound ...
                //clearInterval(game_timer);
                is_game_over = true;
                new Audio("sounds/wrong.mp3").play();
                tick_tock.pause();
                setTimeout(game_over,500);

            } else {
                //correct answer ...
                //plays the sound ...
                new Audio("sounds/"+color+".mp3").play();

                $("#move").text("Buttons left: " + (parseInt(lvl) - (click_counter + 1)).toString());

                if((click_counter + 1) == lvl) {

                    timer_left += 3 + 1;
                    count_down();
                    setTimeout(play, 800);
                    setTimeout(next_lvl,500);
                    
                } 
            }

            button_pressed = false;
        }
    })

}

function game_over() {

    is_game_over = true;
    click_counter = -1;
    lvl = 0;
    basis_pattern = [];
    pressed_pattern = [];
    timer_left = 0;
    clearInterval(game_timer);

    $("#timer").addClass("display-none");
    $("#move").text("back to HOME");
    $("#move").addClass("underline");
    $(".container").slideUp();

    $("#level-title").after("<img src='images/over.gif' id='end_img' />")

    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press any Key to Restart");
    tick_tock.pause();
    
}

function next_lvl() {
    click_counter = -1
    pressed_pattern = [];
    lvl++;
    $("#level-title").text("Level " + lvl);
    $("#move").text("Buttons left: " + lvl);
}

function secondsToTime(e){
    //code not mine
    const h = Math.floor(e / 3600).toString().padStart(2,'0'),
          m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
          s = Math.floor(e % 60).toString().padStart(2,'0');
    
    return h + ':' + m + ':' + s;
    //return `${h}:${m}:${s}`;
}