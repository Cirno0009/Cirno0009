function calcularAmortizacion() {
    const monto = parseFloat(document.getElementById('monto').value);
    const plazo = parseInt(document.getElementById('plazo').value);
    const tasa = parseFloat(document.getElementById('tasa').value);
    const tipoAmortizacion = document.getElementById('tipoAmortizacion').value;

    let cuota, interes, amortizacion, saldo = monto;
    let tablaAmortizacion = '<h2>Tabla de Amortización</h2>';
    tablaAmortizacion += '<table>';
    tablaAmortizacion += '<tr><th>Mes</th><th>Cuota</th><th>Interés</th><th>Amortización</th><th>Saldo</th></tr>';

    let datosGrafico = {
        labels: [],
        datasets: [{
            label: 'Interés',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            data: []
        }, {
            label: 'Amortización',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            data: []
        }]
    };

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
        tablaAmortizacion += `<tr><td>${mes}</td><td>${cuota.toFixed(2)}</td><td>${interes.toFixed(2)}</td><td>${amortizacion.toFixed(2)}</td><td>${saldo.toFixed(2)}</td></tr>`;

        // Agregar datos al gráfico
        datosGrafico.labels.push(`Mes ${mes}`);
        datosGrafico.datasets[0].data.push(interes.toFixed(2));
        datosGrafico.datasets[1].data.push(amortizacion.toFixed(2));
    }

    tablaAmortizacion += '</table>';
    document.getElementById('resultado').innerHTML = tablaAmortizacion;

    // Dibujar el gráfico de amortización
    dibujarGraficoAmortizacion(datosGrafico);
}

function dibujarGraficoAmortizacion(datos) {
    const ctx = document.getElementById('graficoAmortizacion').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: datos,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    ticks: {
                        callback: function (value) {
                            return '$' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': $';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(2);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}
