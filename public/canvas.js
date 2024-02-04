let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");

let penColor = "black";
let eraserColor = "white";
let penWidth = pencilWidthElem.Value;
let eraserWidth = eraserWidthElem.Value;

let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");


let undoRedoTracker = []; //data
let track = 0;  // represents which action from tracker array 

let mouseDown = false;

//API for getting the canvas
let tool = canvas.getContext('2d');

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// mouse down => start new path, mouse move => path feel,  mouse up => end current path

canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    //beginPath({   //Calling beginPath function and passing the value to the strokeObj object
    //    X : e.clientX,
    //    Y : e.clientY
    //});
    let data = {
        X : e.clientX,
        Y : e.clientY
    }
    //send data to server
    socket.emit("beginPath", data); // emit the data to the server socket  
})

canvas.addEventListener('mousemove', (e) => {
    if(mouseDown){
      let data = {
        x: e.clientX,
        y: e.clientY,
        color: eraserFlag ? eraserColor : penColor,
        width: eraserFlag ? eraserWidth : penWidth
      } 
      socket.emit("drawStroke", data); // emit the data to the server 
    } 
});

canvas.addEventListener('mouseup', (e) => {
    mouseDown = false;

    //when mouse is over this code convert the data to url and store it in the undoRedoTracker array and update the track value
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1; //it has the past action store in it    
});

undo.addEventListener('click', (e) => {
    if (track > 0) track--;
    //track action 
    let data = { 
        trackValue : track,
        undoRedoTracker
    }
   // undoRedoCanvas(trackObj);
    socket.emit("redoUndo", data);
});

redo.addEventListener('click', (e) => {
    if ( track < undoRedoTracker.length-1) track++;
    //track action 
    let data = { 
        trackValue : track,
        undoRedoTracker
    }
   // undoRedoCanvas(trackObj);
   socket.emit("redoUndo", data);
});

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); //new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}


function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y); //sets the starting point of the path to the coordinates specified in strokeObj
}
function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click", (e) => {
    if (eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }
    else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
});

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL(); // convert canvas coordinates to dataURL

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
});

//code to receive data from server and display it in the browser

socket.on("beginPath", (data) => {
    //data -> data from server
    beginPath(data);
});

socket.on("drawStroke", (data) => {
    drawStroke(data);
});

socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
});