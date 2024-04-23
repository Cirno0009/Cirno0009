function calcularAmortizacion() {
    const monto = parseFloat(document.getElementById('monto').value);
    const plazo = parseInt(document.getElementById('plazo').value);
    const tasa = parseFloat(document.getElementById('tasa').value);
    const tipoAmortizacion = document.getElementById('tipoAmortizacion').value;

    let cuota, interes, amortizacion, saldo = monto;
    let tablaAmortizacion = '<h2>Tabla de Amortización</h2>';
    tablaAmortizacion += '<table>';
    tablaAmortizacion += '<tr><th>Mes</th><th>Cuota</th><th>Interés</th><th>Amortización</th><th>Saldo</th></tr>';

    // Obtener el canvas y su contexto
    const canvas = document.getElementById('graficoAmortizacion');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calcular los puntos para el gráfico
    const puntos = [];
    let maxCuota = 0;

    for (let mes = 1; mes <= plazo; mes++) {
        switch (tipoAmortizacion) {
            case 'ingles':
                interes = saldo * (tasa / 100);
                amortizacion = monto / plazo;
                cuota = amortizacion + interes;
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
        tablaAmortizacion += `<tr><td>${mes}</td><td>${cuota.toFixed(2)}</td><td>${interes.toFixed(2)}</td><td>${amortizacion.toFixed(2)}</td><td>${saldo.toFixed(2)}</td></tr>`;
        
        // Guardar los puntos para el gráfico
        puntos.push({ x: mes, y: cuota });
        
        // Actualizar el máximo de cuota para el eje Y del gráfico
        if (cuota > maxCuota) {
            maxCuota = cuota;
        }
    }

    tablaAmortizacion += '</table>';
    document.getElementById('resultado').innerHTML = tablaAmortizacion;

    // Dibujar el gráfico de amortización
    const escalaX = canvas.width / plazo;
    const escalaY = canvas.height / maxCuota;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    puntos.forEach((punto, index) => {
        const x = punto.x * escalaX;
        const y = canvas.height - punto.y * escalaY;

        ctx.lineTo(x, y);
        ctx.fillText(`Mes ${punto.x}`, x, y + 20); // Etiqueta de mes

        if (index === puntos.length - 1) {
            ctx.fillText(`Cuota: $${punto.y.toFixed(2)}`, x, y - 10); // Etiqueta de cuota
        }
    });

    ctx.stroke();
}

function exportarExcel() {
    const tabla = document.querySelector('table'); // Selecciona la tabla de amortización
    const nombreArchivo = 'tabla_amortizacion.xlsx';

    // Crea un objeto Blob con los datos de la tabla en formato Excel
    const blob = new Blob([tabla.outerHTML], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Crea un enlace para descargar el archivo Blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click(); // Simula el clic en el enlace para iniciar la descarga
    document.body.removeChild(a); // Elimina el enlace del DOM
    URL.revokeObjectURL(url); // Libera los recursos del Blob
}
