var b2Math = Box2D.Common.Math.b2Math;  
var b2Vec2 = Box2D.Common.Math.b2Vec2
,   b2AABB = Box2D.Collision.b2AABB
,	b2BodyDef = Box2D.Dynamics.b2BodyDef
,	b2Body = Box2D.Dynamics.b2Body
,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,	b2Fixture = Box2D.Dynamics.b2Fixture
,	b2World = Box2D.Dynamics.b2World
,	b2MassData = Box2D.Collision.Shapes.b2MassData
,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
,   b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
,   b2Mat22 = Box2D.Common.Math.b2Mat22
,   b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef
;

//
var world;

//
var worldScreenRect;
var worldScreenScale;

//
var snapage = [];
var garbage = [];

function SetupWorld() 
{
    //
    var screenMax = Math.max(canvas.height, canvas.width);
    var screenMin = Math.min(canvas.height, canvas.width);
    var screenRatio = canvas.width / canvas.height;
    worldScreenScale = 16 / screenMin;
    worldScreenRect = {
        x: 0,
        y: 0,
        w: screenRatio > 1.0 ? 16 : 16 * screenRatio,
        h: screenRatio < 1.0 ? 16 : 16 * screenRatio
    };
    
    //
    world = new b2World( new b2Vec2(0, 10), true );
    
    //
    CreateBounds(worldScreenRect);
      
    //
    var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(window.document.getElementById("canvas").getContext("2d"));
        debugDraw.SetDrawScale(worldScreenScale);
        debugDraw.SetFillAlpha(0);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
    
      
    // Collision events
    var listener = new Box2D.Dynamics.b2ContactListener;
    listener.BeginContact = OnBeginContact;
    listener.EndContact = OnEndContact;
    listener.PostSolve = OnPostSolve;
    listener.PreSolve = OnPreSolve;
    this.world.SetContactListener(listener);

     //update

     function update() {
         
         if (snapage.length > 0) {
             for (var s = 0; s < snapage.length; ++s) {
                 
                var first = puzzlePieces[snapage[s][0]];
                var second = puzzlePieces[snapage[s][1]];
                var point = snapage[s][2];

//                if (first.body == null) {
//                    var tmp = first;
//                    first = second;
//                    second = tmp;
//                }

                var fixDef = new b2FixtureDef;
                fixDef.density = 1.0;
                fixDef.friction = 0.5;
                fixDef.restitution = 0.2;
                fixDef.shape = new b2PolygonShape;
                fixDef.shape.SetAsOrientedBox(1, 1, point, 0);

                var offset = second.fixture.GetUserData().offset;

                var fixture = first.body.CreateFixture(fixDef);


                fixture.SetUserData({ 
                    offset: new b2Vec2( 
                        offset.x + point.x, 
                        offset.y + point.y 
                    ),
                    pieceIndex: second.pieceIndex 
                 });
                 
                 garbage.push(second.body);
//                 second.body = null;
                 second.fixture = fixture;
                 
             }
             
             snapage = [];
         }
         
         if (garbage.length > 0) {
             for (var g = 0; g < garbage.length; ++g) {
                 world.DestroyBody(garbage[g]);
             }
             garbage = [];
         }
         

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

        if(mouseJoint) {
           if(isMouseDown) {
              mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
           } else {
              world.DestroyJoint(mouseJoint);
              mouseJoint = null;
           }
        }

        world.Step(1 / 60, 10, 10);
//
            context.fillStyle = "rgba(0, 0, 0, 0.1)";
         context.fillRect(0,0,canvas.width, canvas.height);
//         context.clearRect(0, 0, canvas.width, canvas.height); 
        world.DrawDebugData();

//         for (var p = 0; p < puzzlePieces.length; ++p) {
//             var puzzlePiece = puzzlePieces[p];
//             puzzlePiece.draw();
//         }
//
//         drawBackground();


        world.ClearForces();
     };
      
     //helpers

     //http://js-tut.aardon.de/js-tut/tutorial/position.html
     function getElementPosition(element) {
        var elem=element, tagname="", x=0, y=0;

        while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
           y += elem.offsetTop;
           x += elem.offsetLeft;
           tagname = elem.tagName.toUpperCase();

           if(tagname == "BODY")
              elem=0;

           if(typeof(elem) == "object") {
              if(typeof(elem.offsetParent) == "object")
                 elem = elem.offsetParent;
           }
        }

        return {x: x, y: y};
     }
    

    // Start Loop
    window.setInterval(Update, 1000 / 60);


  }