var board = [[-1, -1, 1, 1, 1, -1, -1], 
                [-1, -1, 1, 1, 1, -1, -1], 
        [1, 1, 1, 1, 1, 1, 1], 
        [1, 1, 1, 0, 1, 1, 1], 
        [1, 1, 1, 1, 1, 1, 1],
                [-1, -1, 1, 1, 1, -1, -1],
                [-1, -1, 1, 1, 1,-1, -1]];
var selectedId;  
var pegCount = 32;           
$(document).ready(
function init(){
    for(var i in board){
        $('#content').append('<div class=\'pegrow\' id=\''+i+'\'>');
        for(j in board[i]){
            var id = i+"_"+j;
            if(board[i][j] != -1){
                $("#"+i).append('<div class=\'pegSquare\' id=\''+id+'\'>'+board[i][j]+'</div>');
            }
        }
        $('#content').append("</br>");
    }
    $("#pegCount").html("You have " + pegCount + " pegs left.");
    var selected = false;
    var green = "#33ff00";
    var red = "#ff3300";
    var black = "#000000";
    $('.peg')
      .css('cursor', 'pointer')
      .click(
        function(){
            //if there isn't a selected element and this one is reasonable
            if(!selected && first($(this).attr("id"))){
                selected = true;
                selectedId = $(this).attr("id");
                $(this).css('border-color', green);
            //clicked the selected one
            } else if (selected && $(this).attr("id") == selectedId){
                selected = false;
                selectedId = "";
                $(this).css('border-color', black);
            } else if(selected && second($(this).attr("id"))){
                var id = $(this).attr("id");
            	var i = parseInt(id.substr(0, id.indexOf('_')));
				var j = parseInt(id.substr(id.indexOf('_')+1, id.length));
				var selectedI = parseInt(selectedId.substr(0, selectedId.indexOf('_')));
				var selectedJ = parseInt(selectedId.substr(selectedId.indexOf('_')+1, selectedId.length));
				if(selectedI == i - 2){
					//clicked is down from selected
					board[i-1][j] = 0;
					$("#"+(i-1).toString()+"_"+(j).toString()).html("0");
				} else if(selectedJ == j + 2){
					//clicked is left of selected
					board[i][j+1] = 0;
					$("#"+(i).toString()+"_"+(j+1).toString()).html("0");
				} else if(selectedI == i + 2){
					//clicked is up from selected
					board[i+1][j] = 0;
					$("#"+(i+1).toString()+"_"+(j).toString()).html("0");
				} else {
					//clicked is to the right of selected
					board[i][j-1] = 0;
					$("#"+(i).toString()+"_"+(j-1).toString()).html("0");
				}
				board[i][j] = 1;
				board[selectedI][selectedJ] = 0;
				$(this).html("1");
				$("#"+selectedId.toString()).html("0");
				$("#"+selectedId.toString()).css('border-color', black);
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
                    $(this).css('background', green);
                } else {
                    $(this).css('background', red);
                }
            } else {
                 if(second($(this).attr("id"))){
                    $(this).css('background', green);
                } else {
                    $(this).css('background', red);
                }
            }
        },
        function(){
          $(this).css('background', '');
        }
      );
});

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