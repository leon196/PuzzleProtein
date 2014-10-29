// 
var patterns = [ 
    [ 
        [-0.5, -1], [0, -0.5], [0.5, -1] 
    ],[ 
        [-0.5, -1], [0, -1.5], [0.5, -1] 
    ] 
];
var corners = [ [-1, -1], [1, -1], [1, 1], [-1, 1] ];

/***********/
/* ELEMENT */
/***********/

function Element()
{
    this.position = new b2Vec2();
    this.angle = 0;
}

/*********/
/* PIECE */
/*********/

function Piece()
{
    Element.call(this);
    this.patterns;
    this.shape;
    this.puzzleOffset;
}
Piece.prototype = new Element();
Piece.prototype.constructor = Piece;

// Init
Piece.prototype.Setup = function ()
{
    // For logic
    this.patterns = new Array(4);
    for (var i = 0; i < 4; ++i) this.patterns[i] = Math.random() > 0.5 ? 1 : 0;
    // For drawing
    this.shape = [];
    // Corners
    for (var c = 0; c < 4; ++c) {
        this.shape.push(new b2Vec2(corners[c][0], corners[c][1]));
        // Patterns
        for (var p = 0; p < 3; ++p)  {
            var pattern = patterns[this.patterns[c]];
            var rotation = new b2Mat22();
            rotation.Set((c / 4) * Math.PI * 2);
            this.shape.push( b2Math.MulMV( rotation, new b2Vec2(pattern[p][0], pattern[p][1]) ) );
        }
    }
    // For compound object
    this.puzzleOffset = new b2Vec2(0, 0);
};

Piece.prototype.GetShapePosition = function(index)
{
    var rotation = new b2Mat22(); rotation.Set(this.angle);
    return b2Math.MulFV( 
        worldScreenScale, 
        b2Math.AddVV(
            b2Math.MulMV( 
                rotation, 
                b2Math.AddVV( this.puzzleOffset, this.shape[index])
            ), 
            this.position
        ) 
    ); // Body Position + Puzzle Position
};

// Render
Piece.prototype.Draw = function()
{
    var p = this.GetShapePosition(0);
    StartLine( p.x, p.y, '#ffffff' );
    
    for (var i = 1; i < this.shape.length; ++i) {
        p = this.GetShapePosition(i);
        DrawLine( p.x , p.y );
    }
    
    p = this.GetShapePosition(0);
    EndLine( p.x , p.y );
};

/**********/
/* PUZZLE */
/**********/

function Puzzle()
{
    Element.call(this);
    this.body;
    this.pieces;
}

Puzzle.prototype = new Element();
Puzzle.prototype.constructor = Puzzle;

// Init
Puzzle.prototype.Setup = function(x_, y_, angle_)
{
    //
    this.position.Set(x_, y_);
    this.angle = angle_;
    
    //
    this.pieces = [];
    var count = 1 + Math.floor(Math.random() * 3);
    for (var i = 0; i < count; ++i) {
        var piece = new Piece();
        piece.Setup();
        this.pieces.push(piece);
    }
    
    //
    this.body = CreateBody();
    this.body.SetPosition(this.position);
    
    //
    for (var i = 0; i < this.pieces.length; ++i) {
        var x = i % 2;
        var y = Math.floor(i / 2);
        
        x *= 2;
        y *= 2;
        
        var piece = this.pieces[i];
        piece.puzzleOffset = new b2Vec2(x, y);
        
        var fixture = AddBoxAtBody(this.body, x, y, 0);
        fixture.SetUserData(this.pieces[i]);
        
    }
};

// Update
Puzzle.prototype.Update = function()
{
    this.position = this.body.GetPosition();
    this.angle = this.body.GetAngle();
    
    //
    for (var i = 0; i < this.pieces.length; ++i) {
        var piece = this.pieces[i];
        piece.position = this.position;
        piece.angle = this.angle;
        if (!debug)
            piece.Draw();
    }
};

/*********/
/* LOGIC */
/*********/
     
function CheckPattern(infoPieceA, infoPieceB)
{
    var pieceRootA = puzzlePieces[infoPieceA.pieceIndex];
    var pieceRootB = puzzlePieces[infoPieceB.pieceIndex];
    
    // Axes
    var points = [
        new b2Vec2(0, -1),
        new b2Vec2(1, 0),
        new b2Vec2(0, 1),
        new b2Vec2(-1, 0)
    ];

    for (var fixtureA = pieceRootA.fixture; fixtureA ; fixtureA = fixtureA.GetNext())
    {
        // Edges of pieceA
        var pieceA = puzzlePieces[fixtureA.GetUserData().pieceIndex];
        var offsetA = fixtureA.GetUserData().offset;
        for (var i = 0; i < 4; ++i)
        {
            // Get Point
            var rotation = new b2Mat22();
            rotation.Set(pieceA.GetAngle());
            var point = Box2D.Common.Math.b2Math.MulFV(
                scaleDraw,
                Box2D.Common.Math.b2Math.AddVV(
                    pieceA.GetPosition(),
                    Box2D.Common.Math.b2Math.MulMV(rotation, Box2D.Common.Math.b2Math.AddVV(points[i], offsetA))
                )
            );
            for (var fixtureB = pieceRootB.fixture; fixtureB ; fixtureB = fixtureB.GetNext()) 
            {
                // Edges of the pieceB
                var pieceB = puzzlePieces[fixtureB.GetUserData().pieceIndex];
                var offsetB = fixtureB.GetUserData().offset;
                for (var h = 0; h < 4; ++h)
                {    
                    // Get Point
                    rotation = new b2Mat22();
                    rotation.Set(pieceB.GetAngle());
                    var point2 = Box2D.Common.Math.b2Math.MulFV(
                        scaleDraw,
                        Box2D.Common.Math.b2Math.AddVV(
                            pieceB.GetPosition(), 
                            Box2D.Common.Math.b2Math.MulMV(rotation, Box2D.Common.Math.b2Math.AddVV(points[h], offsetB)))
                    );

                    // Distance Test
                    var dist = Box2D.Common.Math.b2Math.SubtractVV(point2, point).Length();
                    if (dist < 16)
                    {
                        // Check Complementarity
                        //if (pieceA.patterns[i] + pieceB.patterns[h] == 1)
                        //{
                            // Debug
                            drawCircle(point, 16);
                            drawCircle(point2, 16);

                            // Snap
                            snapage.push([pieceA.pieceIndex, pieceB.pieceIndex, new b2Vec2(points[i].x * 2, points[i].y * 2)]);

                            //
                            return;
                        //}
                    }
                }
            }
        }
    }

}
