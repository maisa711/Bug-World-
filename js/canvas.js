
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 600;
canvas.height = 520;

// Define hexagonal cell parameters
const hexWidth = 50;
const hexHeight = 45;
const hexRadius = 25;

// Draw hexagonal cells
for (let col = 0; col < 10; col++) {
  for (let row = 0; row < 10; row++) {
    const x = col * hexWidth + ((row % 2) * hexRadius);
    const y = row * hexHeight;

    ctx.beginPath();
    for (let side = 0; side < 6; side++) {
      const angle_deg = 60 * side - 30;
      const angle_rad = Math.PI / 180 * angle_deg;
      const x_i = x + hexRadius * Math.cos(angle_rad);
      const y_i = y + hexRadius * Math.sin(angle_rad);
      if (side === 0) {
        ctx.moveTo(x_i, y_i);
      } else {
        ctx.lineTo(x_i, y_i);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
}
