// Box2D
//var world;
// Canvas
//var context;
//var canvas;
//var ground;
// Puzzle
var puzzle;
var puzzlePieces = [];
var puzzlePieceSize = 8;
var jointWeld = undefined;
//
//var impulse = 100;
//var r = 0;

var canvas = window.document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

init();

function drawText(x, y, text)
{
    context.font = '32pt Calibri';
    context.fillText(text, x, y);
}

function drawLine(a, b)
{
    context.strokeStyle = '#00ff00';
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.stroke();
}

function drawCircle(point, radius)
{
    context.strokeStyle = '#00ff00';
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.stroke();
}

function drawBackground()
{
    context.strokeStyle = '#ffffff';
    context.beginPath();
    context.rect(
        tatamiSize * scaleDraw,
        tatamiSize * scaleDraw,
        worldLimits.x * scaleDraw - tatamiSize * scaleDraw * 2,
        worldLimits.y * scaleDraw - tatamiSize * scaleDraw * 2);
//    context.moveTo(tatamiSize * scaleDraw, tatamiSize * scaleDraw);
//    context.lineTo(worldLimits.x * scaleDraw, tatamiSize * scaleDraw);
//    context.lineTo(worldLimits.x * scaleDraw, worldLimits.y * scaleDraw);
//    context.lineTo(tatamiSize * scaleDraw, worldLimits.y * scaleDraw);
//    context.lineTo(tatamiSize * scaleDraw, tatamiSize * scaleDraw);
    context.stroke();
}
        
        
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