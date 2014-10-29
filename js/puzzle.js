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
    this.shape = new Array(16);
    // Corners
    for (var c = 0; c < 4; ++c) {
        this.shape.push(new b2Vec2(corners[c][0], corners[c][1]));
        // Patterns
//        for (var p = 0; p < 3; ++p)  {
//            var pattern = patterns[this.patterns[c]];
//            console.log(pattern[c][0]);
//            this.shape.push( 
//                b2Math.MulMV( 
//                    new b2Mat22((c / 4) * Math.PI * 2), 
//                    new b2Vec2(pattern[c][0], pattern[c][1]) ) );
//        }
    }
    // For compound object
    this.puzzleOffset = new b2Vec2();
}

// Render
Piece.prototype.Draw = function()
{
    var p = b2Math.AddVV( b2Math.MulMV( new b2Mat22(this.angle), this.shape[0] ), this.position );
    StartLine( p.x, p.y, '#ffffff' );
    for (var i = 1; i < this.shape.length; ++i) {
        p = b2Math.AddVV( b2Math.MulMV( new b2Mat22(this.angle), this.shape[i] ), this.position );
        DrawLine( p.x , p.y );
    }
    p = b2Math.AddVV( b2Math.MulMV( new b2Mat22(this.angle), this.shape[0] ), this.position );
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
    var piece = new Piece();
    piece.Setup();
    this.pieces = [];
    this.pieces.push(piece);
    
    //
    this.body = CreateBody();
    this.body.SetPosition(this.position);
    
    //
    var fixture = AddBoxAtBody(this.body, 0, 0, 0);
    fixture.piece = this.pieces[0];
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
//        piece.Draw();
    }
};

/*********/
/* LOGIC */
/*********/
     
function checkPattern(infoPieceA, infoPieceB)
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
