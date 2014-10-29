// Box2D
var world;
// Canvas
var canvas = window.document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Controls
var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
var canvasPosition = getElementPosition(canvas);
// Game elements
var puzzles;

function OnStart(event)
{
    SetupWorld();

    // Events
    document.addEventListener("mousedown", OnMouseDown, true);
    document.addEventListener("mouseup", onMouseUp, true);
}

/****************/
/* MOUSE EVENTS */
/****************/
    
function OnMouseDown(event)
{
    isMouseDown = true;
    
    // Enable event
    onMouseMove(event);
    document.addEventListener("mousemove", OnMouseMove, true);
}

function OnMouseMove(event)
{
    // Box2D position
    mouseX = (e.clientX - canvasPosition.x) / worldScreenScale;
    mouseY = (e.clientY - canvasPosition.y) / worldScreenScale;
}

function OnMouseUp(event)
{  
    if (!mouseJoint) {
//        createPuzzlePiece(mouseX, mouseY);
    }
    isMouseDown = false;
    mouseX = undefined;
    mouseY = undefined;
    
    // Clean event
    document.removeEventListener("mousemove", OnMouseMove, true);
}

/****************/
/* BOX2D EVENTS */
/****************/

function OnBeginContact(contact) 
{
    var fixtureA, fixtureB; 
    fixtureA = contact.GetFixtureA();
    fixtureB = contact.GetFixtureB();
    console.log('collision');
}

function OnEndContact(contact)
{
}

function OnPreSolve(contact, oldManifold)
{
}
function OnPostSolve(contact, impulse)
{
}