// 
// up -> y > 0
// right -> x > 0
var axes = [ new b2Vec2(1, 0), new b2Vec2(0, 1), new b2Vec2(-1, 0), new b2Vec2(0, -1) ];


var patterns = [ 
    [ 
        [1, -0.5], [0.5, 0], [1, 0.5] 
    ],[ 
        [-0.5, -1], [0, -1.5], [0.5, -1] 
    ] 
];

patterns[0] = [];
patterns[1] = [];

var count = 32;
for (var i = 0; i <= count; ++i) {
    var ratio = i / count;
    var y = lerp(-0.5, 0.5, ratio);
    var x = 1.0 + Math.sin(ratio * Math.PI * 10)*0.1;
    patterns[0].push([x, y]);
    patterns[1].push([x, y]);
}

var corners = [ [1, -1], [1, 1], [-1, 1], [-1, -1] ];

/***********/
/* ELEMENT */
/***********/

function Element()
{
    this.position = new b2Vec2();
    this.angle = 0;
    this.rotation = new b2Mat22();
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
        var pattern = patterns[this.patterns[c]];
        var patternLength = pattern.length;
        var rotation = new b2Mat22();
        var angle = (c / 4) * Math.PI * 2;
        rotation.Set(angle);
        for (var p = 0; p < patternLength; ++p)  {
            this.shape.push( b2Math.MulMV( rotation, new b2Vec2(pattern[p][0], pattern[p][1]) ) );
        }
    }
    // For compound object
    this.puzzleOffset = new b2Vec2(0, 0);
};

// Render
Piece.prototype.Draw = function()
{
    var p = this.GetShapePosition(0);
    StartShape( p.x, p.y );
    
    for (var i = 1; i < this.shape.length; ++i) {
        p = this.GetShapePosition(i);
        DrawShape( p.x , p.y );
    }
    
    p = this.GetShapePosition(0);
    EndShape( p.x , p.y );
};

Piece.prototype.GetShapePosition = function(index)
{
    return b2Math.MulFV( 
        // Scale
        worldScreenScale, 
        b2Math.AddVV(
            b2Math.MulMV( 
                // Body Angle
                this.rotation, 
                // Shape Position + Puzzle Offset
                b2Math.AddVV( this.shape[index], this.puzzleOffset )
            ), 
            // Body Position
            this.position
        ) 
    );
};

Piece.prototype.GetPuzzlePosition = function()
{
    return b2Math.AddVV( b2Math.MulMV( this.rotation, this.puzzleOffset ), this.position );
};