var board = [];

var possible = [];
var possibleReload = [];

const choices = [-1, -1];


let selVol = localStorage.getItem("selectedVolume");
if(selVol == null) selVol = 0.5;

const findSound = new Audio('assets/sounds/won.wav');
const wrongSound = new Audio('assets/sounds/lose.wav');
const clickSound = new Audio('assets/sounds/click.wav');
const ticSound = new Audio('assets/sounds/click3.wav');

findSound.volume = selVol;
wrongSound.volume = selVol;
clickSound.volume = selVol;
ticSound.volume = selVol;

$(".volumeSettings input").val(selVol * 100);
$(".boardSizeSettings input").val(2);


let seconds = 0;
let minutes = 0;
let moves = 0;

let foundCounter = 0;
let needToFind; // 8 pairs

let playing = false;

generateBoard(2) // default size


$(".newGame").click(startGame);


$(".settings").click(function(){
    $(".settingsScreen").toggle();
})
$(document).click(function(event){
    if (!$(event.target).closest('.settingsScreen').length && !$(event.target).closest('.settings').length){
        $(".settingsScreen").hide();
    }      
})
$(".closeSettings").click(function(){
    $(".settingsScreen").hide();
})



//$(".panel").click(function()
$("main").on("click", ".panel", function(){
    // findSound.pause();
    // findSound.currentTime = 0;
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play();
    if(playing == false) startGame();
    moves++;
    $(".moves").text(moves);
    $(".panel").removeClass("onIt");
    
    if(board[$(this).index()] < 0){
        let randomElement = possible[Math.floor(Math.random() * possible.length)];
        board[$(this).index()] = randomElement;
        let index = possible.indexOf(randomElement);
        if (index > -1) {
            possible.splice(index, 1);
        }
    }
    
    $(this).text(board[$(this).index()]);
    index = $(this).index();

    if(choices[0] < 0) {
        choices[0] = index;
        $(this).addClass("onIt");
    }
    else if(choices[1] < 0){
        choices[1] = index;
        
        if(board[choices[0]] == board[choices[1]] && choices[0] != choices[1]){
            findSound.play();
            $(`.panel:nth-of-type(${choices[0] + 1})`).addClass("found");
            $(`.panel:nth-of-type(${choices[1] + 1})`).addClass("found");
            // $(`.panel:nth-of-type(${choices[1] + 1})`).text(board[index]);

            foundCounter++;

            choices[0] = -1;
            choices[1] = -1;

            // console.log(foundCounter, needToFind);
            if(foundCounter == needToFind){
                // console.log("you won!");
                $(".winScreen").toggle();         
                playing = false;
                foundCounter = 0;
                // possible = possibleReload;
                setTimeout(() => {
                    $(".winScreen").toggle();
                    clearBoard();
                }, 1500);
            }
        }
        else{
            // wrongSound.play();
            eraseIncorrect($(`.panel:nth-of-type(${choices[0] + 1})`), $(`.panel:nth-of-type(${choices[1] + 1})`));
            
            choices[0] = -1;
            choices[1] = -1;           
        }
    }
    // console.log(board);
    // console.log(possible);
})


function eraseIncorrect(p1, p2){
    setTimeout(function(){
        if(!p1.hasClass("found")) p1.text('');
        if(!p2.hasClass("found")) p2.text('');
    }, 450)

}

function clearBoard(){
    $(".newGame").text("new game");
    possible = [];
    for(let i=0;i<possibleReload.length;i++){
        possible.push(possibleReload[i]);
    }
    seconds = 0;
    minutes = 0;
    moves = 0;
    for(let i=0;i<board.length;i++){
        board[i] = -1;
    }
    playing = false;
    $(".panel").text('');
    $(".panel").removeClass("found");
    $(".panel").removeClass("onIt");
    $(".time").text("00:00");
    $(".moves").text("0");
}


function timer(){
    if(playing){
        setTimeout(timer, 1000);
        ticSound.pause();
        ticSound.currentTime = 0;
        ticSound.play();
        if(seconds == 59){
            seconds = 0;
            minutes++;
        }
        else seconds++;
    
        if(seconds < 10 && minutes < 10) $(".time").text(`0${minutes}:0${seconds}`);
        else if(seconds < 10) $(".time").text(`${minutes}:0${seconds}`);
        else $(".time").text(`${minutes}:${seconds}`);
    }
    
}

function startGame(){
    if($(".newGame").text() != "end game") $(".newGame").text("end game");
    else $(".newGame").text("new game");

    playing = !playing;
    foundCounter = 0;
    if(!playing) clearBoard();
    else timer();
}

$(".volumeSettings input").on("change keyup input", function(){
    // console.log(clickSound.volume);
    volum = $(".volumeSettings input").val()/100;
    clickSound.volume = volum;
    findSound.volume = volum;
    wrongSound.volume = volum;
    ticSound.volume = volum;

    localStorage.setItem("selectedVolume", volum);
})

$(".boardSizeSettings input").on("change keyup input", function(){generateBoard(parseInt($(".boardSizeSettings input").val()))})


function generateBoard(sizeIdx){
    sizes = [4, 8, 16, 24, 36, 48];
    size = sizes[sizeIdx];
    possibleReload = [];
    $("main").empty();
    console.log("size:", size);
    for(let i=0;i<size;i++){
        $("main").append('<div class="panel"></div>');
        needToFind = size/2;
        if(i<size/2){
            possibleReload.push(i+1);
            possibleReload.push(i+1);
        }    
    }
    possible = [];
    for(let i=0;i<possibleReload.length;i++){
        possible.push(possibleReload[i]);
    }
    board = Array(size).fill(-1);
    foundCounter = 0;
    if(playing) startGame();
    // console.log(possible);

    switch(sizeIdx){
        case 0:
            $("main").css("grid-template-columns", "repeat(2, var(--size)");
            $("main").css("grid-template-rows", "repeat(2, var(--size)");
            break;
        case 1:
            $("main").css("grid-template-columns", "repeat(3, var(--size)");
            $("main").css("grid-template-rows", "repeat(3, var(--size)");
            break;
        case 2:
            $("main").css("grid-template-columns", "repeat(4, var(--size)");
            $("main").css("grid-template-rows", "repeat(4, var(--size)");
            break;
        case 3:
            $("main").css("grid-template-columns", "repeat(5, var(--size)");
            $("main").css("grid-template-rows", "repeat(5, var(--size)");
            break;
        case 4:
            $("main").css("grid-template-columns", "repeat(6, var(--size)");
            $("main").css("grid-template-rows", "repeat(6, var(--size)");
            break;
        case 5:
            $("main").css("grid-template-columns", "repeat(7, var(--size)");
            $("main").css("grid-template-rows", "repeat(7, var(--size)");
            break;
        default:
            $("main").css("grid-template-columns", "repeat(4, var(--size)");
            $("main").css("grid-template-rows", "repeat(4, var(--size)");
    }
    // if(size >= 20) $("main").css("grid-template-columns", "repeat(5, var(--size)");
    // if(size < 20) $("main").css("grid-template-columns", "repeat(4, var(--size)");
}