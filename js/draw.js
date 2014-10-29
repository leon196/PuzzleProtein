
function ClearDraw()
{
    // Cheap blur effect
    context.fillStyle = "rgba(0, 0, 0, 0.2)";
    context.fillRect(0,0,canvas.width, canvas.height);
}

function StartLine(x, y, color)
{
    context.strokeStyle = color; 
    context.fillStyle = '#ff0000';
    context.beginPath();
    context.moveTo(x, y);
}

function DrawLine(x, y)
{
    context.lineTo(x, y);
}

function EndLine(x, y)
{
    DrawLine(x, y);
    
    // Overlapping lines
    context.globalCompositeOperation = "multiply";  
    context.fill();
    
    // Lines
    context.globalCompositeOperation = "source-over";  
    context.stroke();
}


function DrawText(x, y, text)
{
    context.font = '32pt Calibri';
    context.fillText(text, x, y);
}

function DrawCircle(point, radius)
{
    context.strokeStyle = '#00ff00';
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.stroke();
}