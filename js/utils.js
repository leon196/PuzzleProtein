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

function CreateWall(x, y, w, h)
{
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.Set(x, y);
    
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(w, h);

    world.CreateBody(bodyDef).CreateFixture(fixDef);
}


function CreateBounds(rect)
{
    CreateWall(rect.x, rect.y, rect.w, 1);
    CreateWall(rect.x, rect.h, rect.w, 1);
    CreateWall(rect.x, rect.y, 1, rect.h);
    CreateWall(rect.w, rect.y, 1, rect.h);
}



function getBodyAtMouse()
{
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