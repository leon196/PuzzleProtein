  
 var    b2Vec2 = Box2D.Common.Math.b2Vec2
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

var world;
var worldLimits;
var scale = { x: 1, y: 1};
var scaleDraw;
var tatamiSize = 1;

var snapage = [];
var garbage = [];

init();

  function init() {

     world = new b2World(
           new b2Vec2(0, 10)    //gravity
        ,  true                 //allow sleep
     );
      
      console.log(world);

     var fixDef = new b2FixtureDef;
     fixDef.density = 1.0;
     fixDef.friction = 0.5;
     fixDef.restitution = 0.2;

     var bodyDef = new b2BodyDef;

     //create ground
     bodyDef.type = b2Body.b2_staticBody;
     fixDef.shape = new b2PolygonShape;
      
      
      worldLimits = { x: 16, y: 24 };
      
      scaleDraw = Math.max(worldLimits.x, worldLimits.y);
      scaleDraw = Math.min(window.innerWidth / scaleDraw, window.innerHeight / scaleDraw);
      
      //
     fixDef.shape.SetAsBox(worldLimits.x/2, tatamiSize);
     bodyDef.position.Set(worldLimits.x/2, worldLimits.y);
     world.CreateBody(bodyDef).CreateFixture(fixDef);
      
     bodyDef.position.Set(worldLimits.x/2, 0);
     world.CreateBody(bodyDef).CreateFixture(fixDef);
      
      //
      
     fixDef.shape.SetAsBox(tatamiSize, worldLimits.y/2);
     bodyDef.position.Set(0, worldLimits.y/2);
     world.CreateBody(bodyDef).CreateFixture(fixDef);
      
     bodyDef.position.Set(worldLimits.x, worldLimits.y/2);
     world.CreateBody(bodyDef).CreateFixture(fixDef);

     //setup debug draw
     var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(window.document.getElementById("canvas").getContext("2d"));
        debugDraw.SetDrawScale(scaleDraw);
        debugDraw.SetFillAlpha(0);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);

      
      

     window.setInterval(update, 1000 / 60);

     //mouse

     var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
     var canvasPosition = getElementPosition(window.document.getElementById("canvas"));

     document.addEventListener("mousedown", function(e) {
        isMouseDown = true;
        handleMouseMove(e);
        document.addEventListener("mousemove", handleMouseMove, true);
     }, true);

     document.addEventListener("mouseup", function() {
         
         if (!mouseJoint) {
              createPuzzlePiece(mouseX, mouseY);
         }
         
        document.removeEventListener("mousemove", handleMouseMove, true);
        isMouseDown = false;
        mouseX = undefined;
        mouseY = undefined;
         
     }, true);

     function handleMouseMove(e) {
        mouseX = (e.clientX - canvasPosition.x) / scaleDraw;
        mouseY = (e.clientY - canvasPosition.y) / scaleDraw;
     };

     function getBodyAtMouse() {
        mousePVec = new b2Vec2(mouseX, mouseY);
        var aabb = new b2AABB();
        aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
        aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

        // Query the world for overlapping shapes.

        selectedBody = null;
        world.QueryAABB(getBodyCB, aabb);
        return selectedBody;
     }

     function getBodyCB(fixture) {
        if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
           if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
              selectedBody = fixture.GetBody();
              return false;
           }
        }
        return true;
     }
      
      //
        var listener = new Box2D.Dynamics.b2ContactListener;
        listener.BeginContact = function(contact) {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            
            if (fixtureA.GetUserData() && fixtureB.GetUserData()) {
                var puzzlePiece = puzzlePieces[fixtureA.GetUserData().pieceIndex];
                puzzlePiece.checkPattern(puzzlePieces[fixtureB.GetUserData().pieceIndex]);
            }
            
        }
        listener.EndContact = function(contact) {
        // console.log(contact.GetFixtureA().GetBody().GetUserData());
        }
        listener.PostSolve = function(contact, impulse) {

        }
        listener.PreSolve = function(contact, oldManifold) {

        }
        this.world.SetContactListener(listener);

     //update

     function update() {
         
         if (snapage.length > 0) {
             for (var s = 0; s < snapage.length; ++s) {
                 
                 var first = puzzlePieces[snapage[s][0]];
                 var second = puzzlePieces[snapage[s][1]];
                 var point = snapage[s][2];
                 
//                 console.log(first);
                 
                 var fixDef = new b2FixtureDef;
                 fixDef.density = 1.0;
                 fixDef.friction = 0.5;
                 fixDef.restitution = 0.2;
                 fixDef.shape = new b2PolygonShape;
                 fixDef.shape.SetAsOrientedBox(1, 1, point, 0);

                var fixture = first.body.CreateFixture(fixDef);
                 
                 garbage.push(second.body);
                 
                 second.origin = point;
                 second.angle = Math.atan2(-point.y, -point.x);
                 console.log(point);
                 console.log(second.angle);
                 second.body = fixture.GetBody();
//                 second.
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

         for (var p = 0; p < puzzlePieces.length; ++p) {
             var puzzlePiece = puzzlePieces[p];
             puzzlePiece.draw();
         }

         drawBackground();


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


  }