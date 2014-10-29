

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
    CreateWall(rect.x, rect.y - 1, rect.w, 1);
    CreateWall(rect.x, rect.h + 1, rect.w, 1);
    CreateWall(rect.x - 1, rect.y, 1, rect.h);
    CreateWall(rect.w + 1, rect.y, 1, rect.h);
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