
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
    this.origin;
    this.angle;
    // Logic
    this.patterns;
    this.pieceIndex;
    
	this.initialize = function(x, y, index)
    {    
        

         var fixDef = new b2FixtureDef;
         fixDef.density = 1.0;
         fixDef.friction = 0.5;
         fixDef.restitution = 0.2;

         var bodyDef = new b2BodyDef;
         bodyDef.type = b2Body.b2_dynamicBody;
         fixDef.shape = new b2PolygonShape;
        
//        var polyDef = new b2Pol

          //
         fixDef.shape.SetAsBox(1, 1);
        
         bodyDef.position.Set(x, y);
        
          this.body = world.CreateBody(bodyDef);
        
        this.origin = undefined;
        this.angle = undefined;
        
        var fixture = this.body.CreateFixture(fixDef);
        
//        console.log(fixture);
        
        this.pieceIndex = index;
        fixture.SetUserData({ pieceIndex: index});
        
            
//        this.body.SetUserData({ pieceIndex: index });
        
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
//        context.fillStyle = '#ff0000';
        context.beginPath();
        var origin = this.body.GetPosition();
        var position = this.shape[0];       
        
        var angle;
        if (this.angle != undefined) {
            angle = this.angle + this.body.GetAngle();
        }   else {
            angle = this.body.GetAngle();
        }
        
        var rotation = new b2Mat22();
        rotation.Set(angle);
        
            
        var offset = new b2Vec2(0,0);
        if (this.origin != undefined) {
            offset = this.origin;
        }
        
        
        var point = Box2D.Common.Math.b2Math.AddVV(
            origin, 
            Box2D.Common.Math.b2Math.MulMV( 
                rotation, 
                Box2D.Common.Math.b2Math.AddVV(
                    position,
                    offset
                )
            )
        );
        
        context.moveTo(
            point.x * scaleDraw, 
            point.y * scaleDraw);
        
        
        for (var p = 1; p < this.shape.length; ++p)
        {
            position = this.shape[p];
            point = Box2D.Common.Math.b2Math.AddVV(
                origin, 
                Box2D.Common.Math.b2Math.MulMV( 
                    rotation, 
                    Box2D.Common.Math.b2Math.AddVV(
                        position,
                        offset
                    )
                )
            );
            
            context.lineTo ( point.x * scaleDraw,  point.y * scaleDraw );
        }
        position = this.shape[0];
        Box2D.Common.Math.b2Math.AddVV(
            origin, 
            Box2D.Common.Math.b2Math.MulMV( 
                rotation, 
                Box2D.Common.Math.b2Math.AddVV(
                    position,
                    offset
                )
            )
        );
        
        context.lineTo ( point.x * scaleDraw,  point.y * scaleDraw );

//        context.globalCompositeOperation = "xor";
//        context.globalCompositeOperation = "multiply";
//        context.fill();      
//        context.globalCompositeOperation = "destination-in";  
//        context.globalCompositeOperation = "source-over";  
        context.stroke();
    },
        
        
    this.checkPattern = function(other)
    {
        // Axes
        var points = [
            new b2Vec2(0, -1),
            new b2Vec2(1, 0),
            new b2Vec2(0, 1),
            new b2Vec2(-1, 0)
        ];
        
        // Edges of this piece
        for (var i = 0; i < 4; ++i)
        {
            // Get Point
            var rotation = new b2Mat22();
            rotation.Set(this.body.GetAngle());
            var point = Box2D.Common.Math.b2Math.MulFV(
                scaleDraw,
                Box2D.Common.Math.b2Math.AddVV(
                    this.body.GetPosition(), 
                    Box2D.Common.Math.b2Math.MulMV(rotation, points[i]))
            );
            // Edges of the other piece
            for (var h = 0; h < 4; ++h)
            {    
                // Get Point
                rotation = new b2Mat22();
                rotation.Set(other.body.GetAngle());
                var point2 = Box2D.Common.Math.b2Math.MulFV(
                    scaleDraw,
                    Box2D.Common.Math.b2Math.AddVV(
                        other.body.GetPosition(), 
                        Box2D.Common.Math.b2Math.MulMV(rotation, points[h]))
                );
                
                // Distance Test
                var dist = Box2D.Common.Math.b2Math.SubtractVV(point2, point).Length();
                if (dist < 16)
                {
                    // Check Complementarity
                    if (this.patterns[i] + other.patterns[h] == 1)
                    {
                        // Debug
                        drawCircle(point, 16);
                        drawCircle(point2, 16);
                        
                        // Snap
                        snapage.push([this.pieceIndex, other.pieceIndex, new b2Vec2(points[i].x * 2, points[i].y * 2)]);
                        
                        //
                        return;
                    }
                }
            }
        }
        
    }
};