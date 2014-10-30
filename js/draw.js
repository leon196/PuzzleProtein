
function ClearDraw()
{
    // Cheap blur effect
    context.fillStyle = "rgba(0, 0, 0, 0.2)";
    context.fillRect(0,0,canvas.width, canvas.height);
}

function StartShape(x, y)
{
    context.strokeStyle = '#ffffff'; 
//    context.fillStyle = '#ff0000';
    context.beginPath();
    context.moveTo(x, y);
}

function DrawShape(x, y)
{
    context.lineTo(x, y);
}

function EndShape(x, y)
{
    DrawShape(x, y);
    
    // Red layer revealing overlapping lines
//    context.globalCompositeOperation = "multiply";  
//    context.fill();
    
    // Lines
    context.globalCompositeOperation = "source-over";  
    context.stroke();
}

function DrawLine(a, b, color)
{
    context.strokeStyle = color; 
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.stroke();
}

function DrawText(x, y, text)
{
    context.font = '32pt Calibri';
    context.fillText(text, x, y);
}

function DrawCircle(point, radius, color)
{
    context.strokeStyle = color;
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.stroke();
}