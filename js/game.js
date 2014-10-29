// Box2D
var world;
// Canvas
var canvas = window.document.getElementById("canvas");
var context = canvas.getContext("2d");
// Controls
var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
var canvasPosition = getElementPosition(canvas);
// Game
var loop, restart;
var puzzles = [];


/*********/
/* START */
/*********/
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function OnStart()
{
    restart = false;
    
    // Start Box2D
    SetupWorld();

    // Events
    document.addEventListener("mousemove", OnMouseMove, true);
    document.addEventListener("mousedown", OnMouseDown, true);
    document.addEventListener("mouseup", OnMouseUp, true);
    document.addEventListener("keydown", OnKeyDown, true);
    document.addEventListener("keyup", OnKeyUp, true);
    
    //
    loop = window.setInterval(Update, 1000 / 60);
}

/***********/
/* RESTART */
/***********/

function Restart()
{
    for (var i = 0; i < puzzles.length; ++i) {
        garbage.push(puzzles[i].body);
    }
    snapage = [];
    puzzles = [];
    if(mouseJoint) {
        world.DestroyJoint(mouseJoint);
        mouseJoint = null;
    }
}

/*************/
/* GAME LOOP */
/*************/

function Update()
{
    if (restart) {
        Restart();
        restart = false;
    }
         
    // Snap pieces
    if (snapage.length > 0) {
        for (var s = 0; s < snapage.length; ++s) {
        }
        snapage = [];
    }

    // Clean bodies
    if (garbage.length > 0) {
        for (var g = 0; g < garbage.length; ++g) {
            world.DestroyBody(garbage[g]);
        }
        garbage = [];
    }
    
    //
    UpdateBox2DWorld();

    // Drag & Drop Creation
    if(isMouseDown && (!mouseJoint)) {
        var body = getBodyAtMouse();
        if(body) {
            var md = new b2MouseJointDef();
            md.bodyA = world.GetGroundBody();
            md.bodyB = body;
            md.target.Set(mouseX, mouseY);
            md.collideConnected = true;
            md.maxForce = 300.0 * body.GetMass();
            mouseJoint = world.CreateJoint(md);
            body.SetAwake(true);
        }
    }

    // Drag & Drop Update
    if(mouseJoint) {
        if(isMouseDown) {
            mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
        } else {
            world.DestroyJoint(mouseJoint);
            mouseJoint = null;
        }
    }
    
    //
    if (!debug)
        ClearDraw();
    
    // Update & Render Puzzles
    for (var i = 0; i < puzzles.length; ++i) {
        var puzzle = puzzles[i];
        puzzle.Update();
    }
}

/****************/
/* BOX2D EVENTS */
/****************/

function OnBeginContact(contact) 
{
    var fixtureA, fixtureB; 
    fixtureA = contact.GetFixtureA();
    fixtureB = contact.GetFixtureB();
//    console.log(contact);
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

/****************/
/* MOUSE EVENTS */
/****************/
    
function OnMouseDown(event)
{
    isMouseDown = true;
    OnMouseMove(event);
}

function OnMouseMove(event)
{
    // Box2D world position
    mouseX = (event.clientX - canvasPosition.x) / worldScreenScale;
    mouseY = (event.clientY - canvasPosition.y) / worldScreenScale;
}

function OnMouseUp(event)
{  
    // Create Puzzle Piece
    if (!mouseJoint) 
    {
        var puzzle = new Puzzle();
        puzzle.Setup(mouseX, mouseY, 0);
        puzzles.push(puzzle);
    }
    
    //
    isMouseDown = false;
}

/******************/
/* KEYBOARD EVENT */
/******************/

function OnKeyDown(event)
{
}

function OnKeyUp(event)
{
    console.log(event.keyCode);
    var key = event.keyCode;
    
    // D
    if (key == 68) {
        debug = !debug
    }
    // R
    else if (key == 82) {
        restart = true;
    }
}