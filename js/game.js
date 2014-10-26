// Box2D
var world;
// Canvas
var context;
var canvas;
var ground;
var scale;
// Puzzle
var puzzle;
var puzzlePieces = [];
var puzzlePieceSize = 8;
//
var impulse = 100;
var r = 0;
function step(cnt) {
	var stepping = false;
	var timeStep = 1.0/60;
	var iteration = 1;
	world.Step(timeStep, iteration);
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawWorld(world, context);
    
    for (var p = 0; p < puzzlePieces.length; ++p)
    {
        var puzzlePiece = puzzlePieces[p];
        puzzlePiece.draw();
    }
    
    r = 0;
    /*
    for (var c = world.GetContactList() ; c ; c = c.GetNext()){
        var body1 = c.GetShape1().GetBody();
        var body2 = c.GetShape2().GetBody();
        if (r == 0) {
//            console.log(body1.puzzlePieceIndex + " "  + body2.puzzlePieceIndex);
            var piece = puzzlePieces[body1.puzzlePieceIndex];
            var piece2 = puzzlePieces[body2.puzzlePieceIndex];
            
            if (piece != undefined && piece2 != undefined)
            {
                piece.checkPattern(piece2);
            }
                    
                    
            r = 1;
            
//            var index = 
            
//            drawText(
        }
        
        
//        if(body1.GetUserData().name == "Bat" && body2.GetUserData().name == "Ball"){
//        var force = new b2Vec2(200,-(Math.random())*200000);
//        var point = new b2Vec2(body2.GetWorldCenter().x * SCALE,body2.GetWorldCenter().y * SCALE);
//        body2.ApplyForce(force, point);
//        }
//        if(body1.GetUserData().name == "Ball" && body2.GetUserData().name == "Bat"){
//        var force = new b2Vec2(200,-(Math.random())*200000);
//        var point = new b2Vec2(body1.GetWorldCenter().x * SCALE,body1.GetWorldCenter().y * SCALE);
//        body1.ApplyForce(force, point);
    } */
    
	setTimeout('step(' + (cnt || 0) + ')', 10);
}

function drawText(x, y, text) {
    context.font = '32pt Calibri';
      context.fillText(text, x, y);
}

function buildPrismaticJoint(state) {
    var jointDef = new b2PrismaticJointDef();
    jointDef.body1 = state.bodyA;
    jointDef.body2 = state.bodyB;
    jointDef.anchorPoint = state.anchorA;
    jointDef.axis = state.axis;
    jointDef.collideConnected = false;
    jointDef.lowerTranslation = -canvas.width/2;
    jointDef.upperTranslation = canvas.width/2;
    jointDef.enableLimit = true;
    jointDef.maxMotorForce = 400.0;
    jointDef.motorSpeed = 3.0;
    jointDef.enableMotor = true;
    return state.world.CreateJoint(jointDef);
}

Event.observe(window, 'load', function() {
	
	context = $('canvas').getContext('2d');
	canvas = $('canvas'); 
	canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    
    world = createWorld();
    
//    puzzle = {
//        body: createBox(world, canvas.width/2, canvas.height, 200, 64, false)
//    };
//    console.log(puzzle.body);
//    var joint = buildPrismaticJoint({world: world, 
//                                     anchorA: new b2Vec2(canvas.width/2, canvas.height), 
//                                     axis: new b2Vec2(1, 0), 
//                                     bodyA: puzzle.body, 
//                                     bodyB: ground});
    
	Event.observe('canvas', 'click', function(e)
    {
//		createBox(world, Event.pointerX(e), Event.pointerY(e), puzzlePieceSize, puzzlePieceSize, false);
        createPuzzlePiece(Event.pointerX(e) / scale.x, Event.pointerY(e) / scale.y);
	});
    
	Event.observe('canvas', 'contextmenu', function(e) 
    {
        // Cancel context menu
		if (e.preventDefault) e.preventDefault();
        
		return false;
	});
    
    Event.observe(window, 'keypress', function(e) {
        console.log(e.keyCode);
        
        // A
        if (e.keyCode == 97) {
//            puzzle.body.SetLinearVelocity(new b2Vec2(-impulse, 0), puzzle.body.m_position);
        }
        // D
        if (e.keyCode == 100) {
//            puzzle.body.SetLinearVelocity(new b2Vec2(impulse, 0), puzzle.body.m_position);
        }
    });
    
//    Event.observe('canvas', 'mousemove', function(e) {
//    });
//        
//    Event.observe('canvas', 'mousedown', function(e) 
//    });
//     
//    Event.observe('canvas', 'mouseup', function(e) {
//    });
    
	step();
});
