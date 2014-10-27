
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
    this.fixture;
    // Draw
    this.shape;
    this.origin;
    this.angle;
    // Logic
    this.patterns;
    this.pieceIndex;
    
    this.GetPosition = function()
    {
        if (this.body != undefined) {
            return this.body.GetPosition();
        } else {
            return new b2Vec2();
        }
    }
    
    this.GetAngle = function()
    {
        if (this.body != undefined) {
            return this.body.GetAngle();
        } else {
            return new b2Vec2();
        }
    }
    
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
        
        this.fixture = this.body.CreateFixture(fixDef);
        
//        console.log(fixture);
        
        this.pieceIndex = index;
        this.fixture.SetUserData({ 
            offset: new b2Vec2(),
            pieceIndex: index
        });
        
            
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
        var origin = this.GetPosition();
        var position = this.shape[0];       
        
        var angle;
        if (this.angle != undefined) {
            angle = this.angle + this.GetAngle();
        }   else {
            angle = this.GetAngle();
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

//        context.globalCompositeOperation = "xor";
//        context.globalCompositeOperation = "multiply";
//        context.fill();      
//        context.globalCompositeOperation = "destination-in";  
//        context.globalCompositeOperation = "source-over";  
        context.stroke();
    }
};