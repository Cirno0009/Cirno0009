// Función para calcular la amortización
function calcularAmortizacion() {
    const monto = parseFloat(document.getElementById('monto').value);
    const plazo = parseInt(document.getElementById('plazo').value);
    const tasa = parseFloat(document.getElementById('tasa').value);
    const tipoAmortizacion = document.getElementById('tipoAmortizacion').value;

    let cuota, interes, amortizacion, saldo = monto;
    let labels = [];
    let data = [];

    for (let mes = 1; mes <= plazo; mes++) {
        switch (tipoAmortizacion) {
            case 'ingles':
                cuota = monto / plazo;
                interes = saldo * (tasa / 100);
                amortizacion = cuota - interes;
                saldo -= amortizacion;
                break;
            case 'aleman':
                cuota = monto * ((tasa / 100) + (1 / plazo));
                interes = saldo * (tasa / 100);
                amortizacion = cuota - interes;
                saldo -= amortizacion;
                break;
            case 'frances':
                cuota = (monto * (tasa / 100)) / (1 - Math.pow(1 + (tasa / 100), -plazo));
                interes = saldo * (tasa / 100);
                amortizacion = cuota - interes;
                saldo -= amortizacion;
                break;
            case 'flat':
                cuota = (monto / plazo) + (saldo * (tasa / 100));
                interes = saldo * (tasa / 100);
                amortizacion = cuota - interes;
                saldo -= amortizacion;
                break;
            default:
                break;
        }

        labels.push(`Mes ${mes}`);
        data.push(amortizacion.toFixed(2));
    }

    // Mostrar tabla de amortización
    mostrarTabla(labels, data);

    // Dibujar gráfico de amortización
    dibujarGrafico(labels, data);
}

// Función para mostrar la tabla de amortización
function mostrarTabla(labels, data) {
    let tablaAmortizacion = '<h2>Tabla de Amortización</h2>';
    tablaAmortizacion += '<table>';
    tablaAmortizacion += '<tr><th></th><th>Amortización</th></tr>';

    for (let i = 0; i < labels.length; i++) {
        tablaAmortizacion += `<tr><td>${labels[i]}</td><td>${data[i]}</td></tr>`;
    }

    tablaAmortizacion += '</table>';
    document.getElementById('resultado').innerHTML = tablaAmortizacion;
}

// Función para dibujar el gráfico de amortización
function dibujarGrafico(labels, data) {
    var canvas = document.getElementById('graficoAmortizacion');
    var ctx = canvas.getContext('2d');

    // Dibuja el fondo con gradiente
    var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(52, 152, 219, 0.5)'); // Color inicial (azul con transparencia)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Color final (transparente)
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibuja el gráfico de línea
    ctx.strokeStyle = 'rgba(52, 152, 219, 1)'; // Color de la línea
    ctx.lineWidth = 2;
    ctx.beginPath();
    var x = 50; // Posición inicial en x
    var y = canvas.height - 50; // Posición inicial en y
    var stepX = (canvas.width - 100) / (labels.length - 1); // Espacio entre puntos en x
    var maxValue = Math.max(...data); // Valor máximo en los datos
    var stepY = (canvas.height - 100) / maxValue; // Espacio entre puntos en y

    ctx.moveTo(x, y - data[0] * stepY); // Mueve el lápiz al primer punto del gráfico
    for (var i = 1; i < labels.length; i++) {
        x += stepX;
        y = canvas.height - 50 - data[i] * stepY;
        ctx.lineTo(x, y); // Dibuja una línea al siguiente punto
    }
    ctx.stroke(); // Dibuja el trazado

    // Etiquetas en el eje x
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.font = '12px Arial';
    for (var i = 0; i < labels.length; i++) {
        ctx.fillText(labels[i], 50 + i * stepX, canvas.height - 30);
    }

    // Etiquetas en el eje y
    ctx.textAlign = 'right';
    for (var i = 0; i <= maxValue; i += 100) {
        ctx.fillText(i, 40, canvas.height - 50 - i * stepY);
    }
}

// Función para exportar la tabla de amortización a un archivo PDF
function exportarPDF() {
    const tabla = document.querySelector('table'); // Selecciona la tabla de amortización
    const nombreArchivo = 'tabla_amortizacion.pdf';

    // Crea un nuevo documento PDF
    var doc = new jsPDF();

    // Agrega la tabla al documento
    doc.autoTable({ html: tabla });

    // Descarga el documento PDF
    doc.save(nombreArchivo);
}
