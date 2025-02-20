document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ddaForm');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const tableRounded = document.querySelector('#tableRounded tbody');
  const tableDecimal = document.querySelector('#tableDecimal tbody');

  const padding = 20; // Espacio adicional alrededor del gráfico
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  let scaleX, scaleY; // Escalas dinámicas para ajustar el plano

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener los valores ingresados
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const y2 = parseFloat(document.getElementById('y2').value);

    // Determinar los valores mínimos y máximos para ajustar la escala
    const minX = Math.min(x1, x2, 0);
    const maxX = Math.max(x1, x2, 0);
    const minY = Math.min(y1, y2, 0);
    const maxY = Math.max(y1, y2, 0);

    // Ajustar las escalas para que todos los cuadrantes entren en el canvas
    scaleX = (canvasWidth - 2 * padding) / (maxX - minX);
    scaleY = (canvasHeight - 2 * padding) / (maxY - minY);

    // Limpiar el canvas y las tablas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tableRounded.innerHTML = '';
    tableDecimal.innerHTML = '';

    // Dibujar el plano cartesiano
    drawAxes(minX, maxX, minY, maxY);

    // Dibujar la línea usando el algoritmo DDA
    drawLineDDA(x1, y1, x2, y2, minX, minY);
  });

  function drawAxes(minX, maxX, minY, maxY) {
    ctx.font = "10px Arial";
    ctx.fillStyle = "Black";
    ctx.strokeStyle = "lightgray";

    // Dibujar cuadrículas relevantes para todos los cuadrantes
    for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
      const xPos = padding + (x - minX) * scaleX;
      ctx.beginPath();
      ctx.moveTo(xPos, padding);
      ctx.lineTo(xPos, canvas.height - padding);
      ctx.stroke();
      ctx.fillText(x, xPos, canvas.height - padding + 12);
    }

    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const yPos = canvas.height - padding - (y - minY) * scaleY;
      ctx.beginPath();
      ctx.moveTo(padding, yPos);
      ctx.lineTo(canvas.width - padding, yPos);
      ctx.stroke();
      ctx.fillText(y, padding - 12, yPos + 3);
    }

    // Dibujar los ejes principales
    ctx.strokeStyle = "white";
    ctx.beginPath();
    const zeroX = padding + (0 - minX) * scaleX;
    const zeroY = canvas.height - padding - (0 - minY) * scaleY;
    ctx.moveTo(zeroX, padding); // Eje Y
    ctx.lineTo(zeroX, canvas.height - padding);
    ctx.moveTo(padding, zeroY); // Eje X
    ctx.lineTo(canvas.width - padding, zeroY);
    ctx.stroke();
  }

  function drawLineDDA(x1, y1, x2, y2, minX, minY) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const xIncrement = dx / steps;
    const yIncrement = dy / steps;
    let x = x1;
    let y = y1;

    // Dibujar línea continua (decimales)
    ctx.beginPath();
    ctx.moveTo(
      padding + (x1 - minX) * scaleX,
      canvas.height - padding - (y1 - minY) * scaleY
    );

    for (let i = 0; i <= steps; i++) {
      // Dibujar puntos redondeados en rojo
      drawPixel(Math.round(x), Math.round(y), minX, minY, "red");

      // Dibujar línea continua usando valores con decimales
      const xPos = padding + (x - minX) * scaleX;
      const yPos = canvas.height - padding - (y - minY) * scaleY;
      ctx.lineTo(xPos, yPos);

      // Agregar valores a las tablas
      addTableRow(tableRounded, i, Math.round(x), Math.round(y));
      addTableRow(tableDecimal, i, x.toFixed(2), y.toFixed(2));

      // Incrementar los valores de x e y
      x += xIncrement;
      y += yIncrement;
    }

    // Dibujar la línea continua
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function drawPixel(x, y, minX, minY, color) {
    const xPos = padding + (x - minX) * scaleX;
    const yPos = canvas.height - padding - (y - minY) * scaleY;
    ctx.fillStyle = color;
    ctx.fillRect(xPos - 1, yPos - 1, 3, 3); // Punto de tamaño 3x3
  }

  function addTableRow(tableBody, iteration, x, y) {
    const row = document.createElement('tr');
    const cellIteration = document.createElement('td');
    const cellX = document.createElement('td');
    const cellY = document.createElement('td');

    cellIteration.textContent = iteration;
    cellX.textContent = x;
    cellY.textContent = y;

    row.appendChild(cellIteration);
    row.appendChild(cellX);
    row.appendChild(cellY);
    tableBody.appendChild(row);
  }
});