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
var puzzles = [];

/*********/
/* START */
/*********/

function OnStart()
{
    // Start Box2D
    SetupWorld();

    // Events
    document.addEventListener("mousedown", OnMouseDown, true);
    document.addEventListener("mouseup", OnMouseUp, true);
    
    //
    window.setInterval(Update, 1000 / 60);
}

/*************/
/* GAME LOOP */
/*************/

function Update()
{
         
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
        

    // Clear context (with cheap blur effect)
    context.fillStyle = "rgba(0, 0, 0, 0.1)";
    context.fillRect(0,0,canvas.width, canvas.height);
    
    //
    for (var i = 0; i < puzzles.length; ++i) {
        var puzzle = puzzles[i];
        puzzle.Update();
    }
}

/****************/
/* MOUSE EVENTS */
/****************/
    
function OnMouseDown(event)
{
    isMouseDown = true;
    
    // Enable event
    OnMouseMove(event);
    document.addEventListener("mousemove", OnMouseMove, true);
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