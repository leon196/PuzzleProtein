
function createPuzzlePiece(x, y)
{
    if (x < worldLimits.x && y < worldLimits.y) {
        var puzzlePiece = new PuzzlePiece();
        puzzlePiece.initialize(x, y, puzzlePieces.length);
        puzzlePieces.push(puzzlePiece);
    }
}

PuzzlePiece = function()
{
    // Box2d
    this.body;
    // Draw
    this.shape;
    // Logic
    this.patterns;
    
	this.initialize = function(x, y, index)
    {    
        

         var fixDef = new b2FixtureDef;
         fixDef.density = 1.0;
         fixDef.friction = 0.5;
         fixDef.restitution = 0.2;

         var bodyDef = new b2BodyDef;
         bodyDef.type = b2Body.b2_dynamicBody;
         fixDef.shape = new b2PolygonShape;

          //
         fixDef.shape.SetAsBox(1, 1);
         bodyDef.position.Set(x, y);
        
          this.body = world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();
        this.body.SetUserData({ pieceIndex: index });
        
        this.patterns = [];
        for (var part = 0; part < 4; ++part) {
            this.patterns.push(Math.random() >= 0.5 ? 1 : 0);
        }
        
        var size = 1;
        var assets = [
            [
                [-size/2, -size],
                [0, -size/2],
                [size/2, -size]
            ],[
                [-size/2, -size],
                [0, -size*1.5],
                [size/2, -size]
            ]
        ];
        // Corners
        var shape_ = [
            [-size, -size], // Top Left
            [size, -size],  // Top Right
            [size, size],   // Bottom Right
            [-size, size]   // Bottom Left
        ];
        // Contruct Shape
        var point;
        this.shape = [];
        for (var p = 0; p < 4; ++p) 
        {
            // Corner
            point = new b2Vec2(shape_[p][0], shape_[p][1]);
            this.shape.push(point);
            
            // Pattern
            var pattern = assets[this.patterns[p]];
            for (var pat = 0; pat < pattern.length; ++pat) 
            {
                var rotation = new b2Mat22();
                rotation.Set(((p) / 4) * Math.PI * 2);
                var position = new b2Vec2(pattern[pat][0], pattern[pat][1]);
                this.shape.push(Box2D.Common.Math.b2Math.MulMV( rotation, position ));
            }
        }
        
    },
    
    this.draw = function() {
        context.strokeStyle = '#ffffff';
        context.fillStyle = '#ff0000';
        context.beginPath();
        var origin = this.body.GetPosition();
        var position = this.shape[0];       
        var rotation = new b2Mat22();
        rotation.Set(this.body.GetAngle());
        
        var point = Box2D.Common.Math.b2Math.AddVV(
            origin, 
            Box2D.Common.Math.b2Math.MulMV( rotation, position )
        );
        
        context.moveTo(
            point.x * scaleDraw, 
            point.y * scaleDraw);
        
        
        for (var p = 1; p < this.shape.length; ++p)
        {
            position = this.shape[p];
            point = Box2D.Common.Math.b2Math.AddVV(
                origin, 
                Box2D.Common.Math.b2Math.MulMV( rotation, position )
            );
            context.lineTo(
            point.x * scaleDraw, 
            point.y * scaleDraw);
        }
        position = this.shape[0];
        point = Box2D.Common.Math.b2Math.AddVV(
            origin, 
            Box2D.Common.Math.b2Math.MulMV( rotation, position )
        );
        context.lineTo(
            point.x * scaleDraw, 
            point.y * scaleDraw);

//        context.globalCompositeOperation = "xor";
        context.globalCompositeOperation = "multiply";
        context.fill();      
//        context.globalCompositeOperation = "destination-in";  
        context.globalCompositeOperation = "source-over";  
        context.stroke();
    },
        
        
    this.checkPattern = function(otherPiece)
    {
        /*
        var dir = new b2Vec2(
            otherPiece.physic.m_position.x - this.physic.m_position.x,
            otherPiece.physic.m_position.y - this.physic.m_position.y);
        
        var dist = dir.Length();
        
        dir.Normalize();
        
        var x = 0;
        var y = 0;
        
        var points = [
            new b2Vec2(0, -puzzlePieceSize),
            new b2Vec2(0, puzzlePieceSize),
            new b2Vec2(-puzzlePieceSize, 0),
            new b2Vec2(puzzlePieceSize, 0)
        ];
        
        var vec = new b2Vec2();
        
        
//        context.strokeStyle = '#ff0000';
//        context.beginPath();
        for (var i = 0; i < 4; ++i) {
            var point = b2Math.AddVV(this.physic.m_position, b2Math.b2MulMV(this.physic.m_R, points[i]));
            for (var h = 0; h < 4; ++h) {
                var point2 = b2Math.AddVV(otherPiece.physic.m_position, b2Math.b2MulMV(otherPiece.physic.m_R, points[h]));
//                if (i == 0) {

//        context.moveTo(point.x, point.y);
//        context.lineTo(point2.x, point2.y);
//                }
                
                var direction = b2Math.SubtractVV(point2, point);
                var distance = direction.Length();
                if (distance < 32) {
//                console.log(distance);
//                    vec = direction.Normalize();
                    var jointWeld = new b2RevoluteJointDef();
                    jointWeld.body1 = this.physic;
                    jointWeld.body2 = otherPiece.physic;
                    jointWeld.collideConnected = false;
//                    jointWeld.localAnchor1 = new b2Vec2(-0.5, -0.5);
//                    jointWeld.localAnchor2 = new b2Vec2(0.5, 0.5);
                    world.CreateJoint(jointWeld);
                    return;
                }
            }

        }
//        context.stroke();
        
        
//        vec = b2Math.b2MulMV(this.physic.m_R, this.physic.m_position);

//        context.strokeStyle = '#ff0000';
//        context.beginPath();
//
//        context.moveTo(this.physic.m_position.x, this.physic.m_position.y);
//        context.lineTo(this.physic.m_position.x + vec.x * 16, this.physic.m_position.y + vec.y * 16);
//
//        context.moveTo(otherPiece.physic.m_position.x, otherPiece.physic.m_position.y);
//        context.lineTo(otherPiece.physic.m_position.x - vec.x * 16, otherPiece.physic.m_position.y - vec.y * 16);
//
//        context.stroke();*/
    }
};

/*
function createPuzzlePiece(x, y)
{
    
    var size = puzzlePieceSize;
    var sizeHalf = size / 2;
    
    var polyBd = new b2BodyDef();
    
	var boxSd = new b2BoxDef();
    boxSd.density = 1.0;
	boxSd.extents.Set(size, size);
	boxSd.restitution = 0.2;
    
    var radius = size/2;
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = radius;
	ballSd.friction = 0;
    ballSd.localPosition.Set(size, 0);
    
//    polyBd.AddShape(boxSd);
//    polyBd.AddShape(ballSd);
    
    var polygons = [];

    var triangle = [
        [-size, -size], 
        [size, -size], 
        [0, 0]
    ];

    var pattern = [
        [-size * 0.5, -size],
        [0, -size * 1.5],
        [size * 0.5, -size]
    ];

    var pattern2a = [
        [0, 0], 
        [-size, -size], 
        [-sizeHalf, -size],
        [0, -sizeHalf]
    ];

    var pattern2b = [
        [0, 0], 
        [size, -size], 
        [sizeHalf, -size],
        [0, -sizeHalf]
    ];
    
    var poly;
        
    poly = createPoly(pattern);
    poly.density = 0.1;
    
    polygons[0] = poly;
    
    poly = createPoly(pattern);
    poly.localRotation = Math.PI / 2;
    poly.density = 0.1;
    
    polygons[1] = poly;
    
    poly = createPoly(triangle);
    poly.density = 0.2;
    
    polygons[2] = poly;
    
    poly = createPoly(triangle);
    poly.localRotation = Math.PI / 2;
    poly.density = 0.2;
    
    polygons[3] = poly;
    
    poly = createPoly(pattern2a);
    poly.localRotation = Math.PI;
    poly.density = 0.2;
    
    polygons[4] = poly;
    
    poly = createPoly(pattern2b);
    poly.localRotation = Math.PI;
    poly.density = 0.2;
    
    polygons[5] = poly;
    
    poly = createPoly(triangle);
    poly.localRotation = Math.PI * 3 / 2;
    poly.density = 0.2;
    
    polygons[6] = poly;
    
    
//    	var R1 = new b2Mat22(poly.localRotation);
//    	poly.localPosition = b2Math.b2MulMV(R1, new b2Vec2(30, 0));
        
//        polygons[i] = poly;
//    }
	
    for (var p = 0; p < polygons.length; ++p) {
        polyBd.AddShape(polygons[p]);
    }
	
    
    polyBd.position.Set(x,y);
	return world.CreateBody(polyBd)
}*/