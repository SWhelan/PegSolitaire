var board = [[-1, -1, 1, 1, 1, -1, -1], 
                [-1, -1, 1, 1, 1, -1, -1], 
        [1, 1, 1, 1, 1, 1, 1], 
        [1, 1, 1, 0, 1, 1, 1], 
        [1, 1, 1, 1, 1, 1, 1],
                [-1, -1, 1, 1, 1, -1, -1],
                [-1, -1, 1, 1, 1,-1, -1]];
var selectedId;
var pegCount = 32;
var lastBoard  = [[-1, -1, 1, 1, 1, -1, -1], 
                [-1, -1, 1, 1, 1, -1, -1], 
        [1, 1, 1, 1, 1, 1, 1], 
        [1, 1, 1, 0, 1, 1, 1], 
        [1, 1, 1, 1, 1, 1, 1],
                [-1, -1, 1, 1, 1, -1, -1],
                [-1, -1, 1, 1, 1,-1, -1]];       
$(document).ready(
function init(){
	createBoard();
    $("#pegCount").html("You have " + pegCount + " pegs left.");
    $("#undo").css("color", "#cccccc");
    var selected = false;
    $('.pegSquare')
      .css('cursor', 'pointer')
      .click(
        function(){
            //if there isn't a selected element and this one is reasonable
            if(!selected && first($(this).attr("id"))){
                selected = true;
                selectedId = $(this).attr("id");
                $(this).addClass('selected');
            //clicked the selected one
            } else if (selected && $(this).attr("id") == selectedId){
                selected = false;
                selectedId = "";
                $(this).removeClass('selected');
            } else if(selected && second($(this).attr("id"))){
                for(var i in board){
                    for(j in board[i]){
						lastBoard[i][j] = board[i][j];
                    }
                }
                $('#undo').css("color", "#000000");
                var id = $(this).attr("id");
            	var i = parseInt(id.substr(0, id.indexOf('_')));
				var j = parseInt(id.substr(id.indexOf('_')+1, id.length));
				var selectedI = parseInt(selectedId.substr(0, selectedId.indexOf('_')));
				var selectedJ = parseInt(selectedId.substr(selectedId.indexOf('_')+1, selectedId.length));
				if(selectedI == i - 2){
					//clicked is down from selected
					board[i-1][j] = 0;
					$("#"+(i-1).toString()+"_"+(j).toString()).addClass("hole");
					$("#"+(i-1).toString()+"_"+(j).toString()).removeClass("peg");
				} else if(selectedJ == j + 2){
					//clicked is left of selected
					board[i][j+1] = 0;
					$("#"+(i).toString()+"_"+(j+1).toString()).addClass("hole");
					$("#"+(i).toString()+"_"+(j+1).toString()).removeClass("peg");
				} else if(selectedI == i + 2){
					//clicked is up from selected
					board[i+1][j] = 0;
					$("#"+(i+1).toString()+"_"+(j).toString()).addClass("hole");
					$("#"+(i+1).toString()+"_"+(j).toString()).removeClass("peg");
				} else {
					//clicked is to the right of selected
					board[i][j-1] = 0;
					$("#"+(i).toString()+"_"+(j-1).toString()).addClass("hole");
					$("#"+(i).toString()+"_"+(j-1).toString()).removeClass("peg");
				}
				board[i][j] = 1;
				board[selectedI][selectedJ] = 0;
				$(this).addClass("peg");
				$(this).removeClass("hole");
				$("#"+selectedId.toString()).addClass("hole");
				$("#"+selectedId.toString()).removeClass("peg");
				$("#"+selectedId.toString()).removeClass('selected');
				selectedId = "";
				selected = false;
				pegCount--;
				if(pegCount == 1){
					$("#pegCount").html("You have " + pegCount + " peg left. Congratulations you won!");
				} else {
					$("#pegCount").html("You have " + pegCount + " pegs left.");
				}
				if(finished()){
					alert("Game Over");
				}
            }
        }
      )
      .hover(
        function(){
            if(!selected){
               if(first($(this).attr("id"))){
                    $(this).addClass('greenHover');
                } else {
                    $(this).addClass('redHover');
                }
            } else {
                 if(second($(this).attr("id"))){
                    $(this).addClass('greenHover');
                } else if(!$(this).hasClass("selected")) {
                    $(this).addClass('redHover');
                }
            }
        },
        function(){
          $(this).removeClass('greenHover');
          $(this).removeClass('redHover');
        }
      );
      
     $('#newGame')
      .css('cursor', 'pointer')
      .click(
        function(){
			board = [[-1, -1, 1, 1, 1, -1, -1], 
			                [-1, -1, 1, 1, 1, -1, -1], 
			        [1, 1, 1, 1, 1, 1, 1], 
			        [1, 1, 1, 0, 1, 1, 1], 
			        [1, 1, 1, 1, 1, 1, 1],
			                [-1, -1, 1, 1, 1, -1, -1],
			                [-1, -1, 1, 1, 1,-1, -1]];
			selectedId;  
			pegCount = 32;  
			$("#content").empty();
			init();      
        }
      );
      
    $('#undo')
    .css('cursor', 'pointer')
    .click(
        function(){
        $("#content").empty();
            for(var i in board){
                for(j in board[i]){
					board[i][j] = lastBoard[i][j];
                }
            }
            pegCount = 0;
            for(var i in board){
                for(j in board[i]){
                    if(board[i][j] == 1){
                    pegCount++;
                    }
                }
	        }                           
	    init();
		}
    );
});

function createBoard(){
    for(var i in board){
        $('#content').append('<div class=\'pegrow\' id=\''+i+'\'>');
        for(j in board[i]){
            var id = i+"_"+j;
            if(board[i][j] != -1){
                var className = "peg";
                if(board[i][j] == 0){
                    className = "hole";
                }
                $("#"+i).append('<div class=\'pegSquare '+className+'\' id=\''+id+'\'></div>');
            }
        }
        $('#content').append("</br>");
    }    
}

function first(id){
	//this determines if it is an allowable first move
	var i = parseInt(id.substr(0, id.indexOf('_')));
	var j = parseInt(id.substr(id.indexOf('_')+1, id.length));
	
	if (board[i][j] == 1 && (
		(i - 2 >= 0 && board[i-1][j] == 1 && board[i-2][j] == 0) ||
		(j + 2 <= 6 && board[i][j+1] == 1 && board[i][j+2] == 0) ||
		(i + 2 <= 6 && board[i+1][j] == 1 && board[i+2][j] == 0) ||
		(j - 2 >= 0 && board[i][j-1] == 1 && board[i][j-2] == 0) )
	   ){
	    return true;
	   } else {
	    return false;
	   }
}

function second(id){
	var i = parseInt(id.substr(0, id.indexOf('_')));
	var j = parseInt(id.substr(id.indexOf('_')+1, id.length));
	
	var selectedI = parseInt(selectedId.substr(0, selectedId.indexOf('_')));
	var selectedJ = parseInt(selectedId.substr(selectedId.indexOf('_')+1, selectedId.length));
	
	if (board[i][j] == 0 && (
		(selectedI == i - 2 && board[i-1][j] == 1) ||
		(selectedJ == j + 2 && board[i][j+1] == 1) ||
		(selectedI == i + 2 && board[i+1][j] == 1) ||
		(selectedJ == j - 2 && board[i][j-1] == 1)
		)
	){
		return true;
		} else {
		return false;
		}
}

function finished() {
	var finished = true;
	for(var i in board){
	    for(j in board[i]){
	        var id = i+"_"+j;
	        if(board[i][j] != -1){
	            if(first(id)){
	                finished = false;
	            }
	        }
	    }
    }
    return finished;
}