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
var worldScreenRect;
var worldScreenScale;

//
var snapage = [];
var garbage = [];

//
var debug = false;

function SetupWorld() 
{
    //
    var scale = 16;
    var screenMax = Math.max(canvas.height, canvas.width);
    var screenMin = Math.min(canvas.height, canvas.width);
    var screenRatio = canvas.width / canvas.height;
    worldScreenScale = screenMax / scale;
    console.log("scale : " + worldScreenScale);
    worldScreenRect = {
        x: 0,
        y: 0,
        w: screenRatio > 1.0 ? scale : scale / screenRatio,
        h: screenRatio < 1.0 ? scale : scale / screenRatio
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
}

function UpdateBox2DWorld()
{
    world.Step(1 / 60, 10, 10);
    world.ClearForces();
    if (debug) world.DrawDebugData();
}

function CreateBody()
{
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;

    return world.CreateBody(bodyDef);
}

function AddBoxAtBody(body, x, y, angle)
{
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsOrientedBox(1, 1, new b2Vec2(x, y), angle);

    return body.CreateFixture(fixDef);
}