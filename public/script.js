let toolsCont = document.querySelector(".tools-cont");
let optionsCont = document.querySelector(".options-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let optionsFlag = true;
let pencilFlag = false;
let eraserFlag = false;


//true => show tool bar AND false => hide tool bar

optionsCont.addEventListener("click", (e) => {
    optionsFlag = !optionsFlag; //making true false and false true
    // true -> tools show, false -> hide tools
    if(optionsFlag) openTools();
    else closeTools();
}); 

function openTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-x");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "flex";
}

function closeTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-x");
    toolsCont.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
    //true -> show pencil tool, false -> hide pencil tool
    pencilFlag = !pencilFlag;

    if (pencilFlag) {
        pencilToolCont.style.display = "block";
    }
    else {
        pencilToolCont.style.display = "none";
    }
});

eraser.addEventListener("click", (e) => {
    //true -> show eraser tool, false -> hide eraser tool
    eraserFlag = !eraserFlag;

    if (eraserFlag)   eraserToolCont.style.display = "flex";
    else    eraserToolCont.style.display = "none";
});

sticky.addEventListener("click", (e) => {

    //This block of code sets the inner HTML of stickyCont to a string containing HTML code for a note container. 
    let stickyTemplateHTML =  ` 
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea name="Notes" cols="30" rows="10"></textarea>
        </div>
    `; 
    createSticky(stickyTemplateHTML);
})

upload.addEventListener("click", (e) => {   //it has almost the same code as a sticky note
    
    //this open the file explorer of the current computer
    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src="${url}"/>
        </div>
        `;
        createSticky(stickyTemplateHTML);
    })
})

function noteActions(minimize, remove, stickyCont){
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })
    minimize.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".note-cont");

        // Get the computed style of the "note-cont" element and retrieve the "display" property
        let display = getComputedStyle(noteCont).getPropertyValue("display");

        if( display == "none") noteCont.style.display = "block"; // If the display is "none", change it to "block"
        else noteCont.style.display = "none";  // If the display is not "none", change it to "none"

    })
}

function dragAndDrop(element, event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    //document.body.append(element);

    moveAt(event.pageX, event.pageY);
    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account

    function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + 'px';
      element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
    // drop the ball, remove unneeded handlers
    element.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
    };
}

function createSticky(stickyTemplateHTML) {

    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont"); 
    stickyCont.innerHTML = stickyTemplateHTML; 

    
    //This line appends the stickyCont div to the body element of the HTML document. 
    //This effectively adds a new "sticky note" to the body of the document when the sticky element is clicked.
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");

    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function(event) {
        dragAndDrop(stickyCont, event);
    };
        
    stickyCont.ondragstart = function() {
      return false;
    };
}
