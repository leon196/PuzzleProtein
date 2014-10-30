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
    var count = 1 + Math.floor(Math.random() * 2);
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
    this.rotation.Set(this.angle);
    
    //
    for (var i = 0; i < this.pieces.length; ++i) {
        var piece = this.pieces[i];
        piece.position = this.position;
        piece.angle = this.angle;
        piece.rotation = this.rotation;
        if (!debug)
            piece.Draw();
    }
};

/*********/
/* LOGIC */
/*********/

function TestSnap(fixtureA, fixtureB)
{
    var pieceA = fixtureA.GetUserData();
    var pieceB = fixtureB.GetUserData();
    if (pieceA != undefined && pieceB != undefined) {
        FindSnappingEdges(pieceA, pieceB);
    }
}

function FindSnappingEdges(pieceA, pieceB)
{
    for (var a = 0; a < 4; ++a) {
        var pointA = b2Math.AddVV( pieceA.GetPuzzlePosition(), b2Math.MulMV( pieceA.rotation, axes[a] ) );
        
        for (var b = 0; b < 4; ++b) {
            var pointB = b2Math.AddVV( pieceB.GetPuzzlePosition(), b2Math.MulMV( pieceB.rotation, axes[b] ) );
            var dist = b2Math.SubtractVV(pointA, pointB).Length();
            
            if (dist < 0.2) {
                var a = b2Math.MulFV( worldScreenScale, pointA );
                var b = b2Math.MulFV( worldScreenScale, pointB );
                DrawCircle(a, 16, '#00ff00');
//                DrawLine(a, b, '#00ff00');
                DrawCircle(b, 16, '#00ff00');
                return;
            }
        }
    }
}
     
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
