PuzzlePiece = function()
{
    // Box2d
    this.physic;
    // Draw
    this.shape;
    // Logic
    this.patterns;
    
	this.initialize = function(x, y, index)
    {    
        this.physic = createBox(world, x, y, puzzlePieceSize, puzzlePieceSize, false);
        this.physic.puzzlePieceIndex = index;
        
        this.patterns = [];
        for (var part = 0; part < 4; ++part) {
            this.patterns.push(Math.random() >= 0.5 ? 1 : 0);
        }
        
        var size = puzzlePieceSize;
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
        for (var p = 0; p < 4; ++p) {
            point = new b2Vec2(shape_[p][0], shape_[p][1]);
            this.shape.push(point);
            
            var pattern = assets[this.patterns[p]];
            
            for (var pat = 0; pat < pattern.length; ++pat) 
            {
                var R1 = new b2Mat22(((p) / 4) * Math.PI * 2);
                point = b2Math.b2MulMV(R1, new b2Vec2(pattern[pat][0], pattern[pat][1]));

                this.shape.push(point);
            }
        }
        
    },
        
    this.checkPattern = function(otherPiece)
    {
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
//        context.stroke();
    },
    
    this.draw = function() {
        context.strokeStyle = '#ffffff';
        context.beginPath();
        
        var position = b2Math.AddVV(this.physic.m_position, b2Math.b2MulMV(this.physic.m_R, this.shape[0]));
        context.moveTo(position.x, position.y);
        
        for (var p = 1; p < this.shape.length; ++p)
        {
            position = b2Math.AddVV(this.physic.m_position, b2Math.b2MulMV(this.physic.m_R, this.shape[p]));
            context.lineTo(position.x * scale.x, position.y * scale.y);
        }
        
        position = b2Math.AddVV(this.physic.m_position, b2Math.b2MulMV(this.physic.m_R, this.shape[0]));
        context.lineTo(position.x, position.y);
        
        context.stroke();
        
//        
//        context.strokeStyle = '#00ff00';
//        context.beginPath();
//        
//        var vec;
//        
//        context.moveTo(this.physic.m_position.x, this.physic.m_position.y);
//        vec = b2Math.AddVV(this.physic.m_position, b2Math.b2MulMV(this.physic.m_R, new b2Vec2(0, -puzzlePieceSize)));
//        context.lineTo(vec.x, vec.y);
//        
//        context.stroke();
//        
//        
//        context.strokeStyle = '#0000ff';
//        context.beginPath();
//        
//        context.moveTo(this.physic.m_position.x, this.physic.m_position.y);
//        vec = b2Math.AddVV(this.physic.m_position, b2Math.b2MulMV(this.physic.m_R, new b2Vec2(puzzlePieceSize, 0)));
//        context.lineTo(vec.x, vec.y);
//        
//        context.stroke();
    }
};
function createPuzzlePiece(x, y)
{
    var puzzlePiece = new PuzzlePiece();
    puzzlePiece.initialize(x, y, puzzlePieces.length);
    puzzlePieces.push(puzzlePiece);
}

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