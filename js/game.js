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
//
//var impulse = 100;
//var r = 0;

var canvas = window.document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawText(x, y, text)
{
    context.font = '32pt Calibri';
    context.fillText(text, x, y);
}

function drawLine(a, b)
{
    context.strokeStyle = '#ffffff';
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
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