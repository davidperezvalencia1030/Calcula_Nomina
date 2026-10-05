const tablaVacacionesData = [
    { min: 1, max: 365, dias: 6 },
    { min: 366, max: 730, dias: 8 },
    { min: 731, max: 1095, dias: 10 },
    { min: 1096, max: 1460, dias: 12 },
    { min: 1461, max: 1825, dias: 14 },
    { min: 1826, max: 2190, dias: 16 },
    { min: 2191, max: 2555, dias: 18 },
    { min: 2556, max: 2920, dias: 20 },
    { min: 2921, max: 3285, dias: 22 },
    { min: 3286, max: 3650, dias: 24 },
    { min: 3651, max: 4015, dias: 26 },
    { min: 4016, max: 4380, dias: 28 },
    { min: 4381, max: 4745, dias: 30 },
    { min: 4746, max: 5110, dias: 32 }
];

// Inicializar la tabla de vacaciones al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const tablaBody = document.getElementById('tablaVacaciones');
    tablaBody.innerHTML = '';
    
    tablaVacacionesData.forEach((item, index) => {
        const row = document.createElement('tr');
        const años = index + 1;
        
        if (años === 1) {
            row.innerHTML = `<td>0-1 año</td><td>${item.dias} días</td>`;
        } else if (años === 14) {
            row.innerHTML = `<td>14+ años</td><td>${item.dias} días</td>`;
        } else {
            row.innerHTML = `<td>${años} años</td><td>${item.dias} días</td>`;
        }
        
        tablaBody.appendChild(row);
    });
});

function calcularNomina() {
    const tipoPago = parseFloat(document.getElementById('tipoPago').value);
    const cantidadPago = parseFloat(document.getElementById('cantidadPago').value);
    const jornada = parseFloat(document.getElementById('jornada').value);
    const horasExtras = parseInt(document.getElementById('horasExtras').value) || 0;

    const fechaInicio = new Date(document.getElementById('fechaInicio').value);
    const fechaFin = new Date(document.getElementById('fechaFin').value);

    if (isNaN(cantidadPago)) {
        alert("Por favor ingrese una cantidad válida");
        return;
    }

    if (cantidadPago <= 0) {
        alert("La cantidad percibida debe ser mayor a cero");
        return;
    }

    if (isNaN(fechaInicio) || isNaN(fechaFin) || fechaFin <= fechaInicio) {
        alert("Por favor ingresa un rango de fechas válido.");
        return;
    }

    const tiempo = fechaFin.getTime() - fechaInicio.getTime();
    const diasTrabajados = Math.floor(tiempo / (1000 * 60 * 60 * 24));

    if (diasTrabajados <= 0) {
        alert("Los días trabajados deben ser mayor a cero");
        return;
    }
    
    // 1. Calcular Sueldo Diario (S.D.)
    const sueldoDiario = cantidadPago / tipoPago;
    
    // 2. Calcular Salario Diario Integrado (S.D.I.)
    const sdi = sueldoDiario * 1.0452;
    
    // 3. Calcular Costo por Hora (C.P.H.)
    const costoHora = sueldoDiario / jornada;
    
    // 4. Calcular Horas Extras
    let horasDobles = Math.min(Math.max(horasExtras, 0), 9);
    let horasTriples = Math.max(horasExtras - 9, 0);
    
    const pagoHorasDobles = horasDobles * costoHora * 2;
    const pagoHorasTriples = horasTriples * costoHora * 3;
    const totalHorasExtras = pagoHorasDobles + pagoHorasTriples;
    
    // 5. Calcular Vacaciones
    const { diasVacaciones, rangoActual } = calcularDiasVacaciones(diasTrabajados);
    const pagoVacaciones = sueldoDiario * diasVacaciones;
    const primaVacacional = pagoVacaciones * 0.25;
    const totalVacaciones = pagoVacaciones + primaVacacional;
    
    // Resaltar fila actual en la tabla de vacaciones
    resaltarRangoVacaciones(rangoActual);
    
    // 6. Calcular Aguinaldo
    let diasAguinaldo = 0;
    let aguinaldo = 0;
    
    if (diasTrabajados >= 365) {
        diasAguinaldo = 15;
        aguinaldo = sueldoDiario * 15;
    } else {
        diasAguinaldo = (diasTrabajados * 15) / 365;
        aguinaldo = sueldoDiario * diasAguinaldo;
    }
    
    // Calcular total a pagar
    const totalPagar = sueldoDiario * tipoPago + totalHorasExtras + totalVacaciones + aguinaldo;
    
    // Mostrar resultados en el cuadro de resumen
    document.getElementById('resumen-sueldoDiario').textContent = formatCurrency(sueldoDiario);
    document.getElementById('resumen-sdi').textContent = formatCurrency(sdi);
    document.getElementById('resumen-costoHora').textContent = formatCurrency(costoHora);
    document.getElementById('resumen-horasDobles').textContent = formatCurrency(pagoHorasDobles);
    document.getElementById('resumen-horasTriples').textContent = formatCurrency(pagoHorasTriples);
    document.getElementById('resumen-totalHorasExtras').textContent = formatCurrency(totalHorasExtras);
    document.getElementById('resumen-diasVacaciones').textContent = diasVacaciones.toFixed(2) + " días";
    document.getElementById('resumen-totalVacaciones').textContent = formatCurrency(totalVacaciones);
    document.getElementById('resumen-aguinaldo').textContent = formatCurrency(aguinaldo);
    document.getElementById('resumen-totalPagar').textContent = formatCurrency(totalPagar);
    
    // Mostrar resultados detallados
    document.getElementById('sueldoDiario').textContent = formatCurrency(sueldoDiario);
    document.getElementById('sdi').textContent = formatCurrency(sdi);
    document.getElementById('costoHora').textContent = formatCurrency(costoHora);
    document.getElementById('horasExtrasDobles').textContent = `${horasDobles} hrs = ${formatCurrency(pagoHorasDobles)}`;
    document.getElementById('horasExtrasTriples').textContent = `${horasTriples} hrs = ${formatCurrency(pagoHorasTriples)}`;
    document.getElementById('totalHorasExtras').textContent = formatCurrency(totalHorasExtras);
    document.getElementById('diasVacaciones').textContent = diasVacaciones.toFixed(2) + " días";
    document.getElementById('pagoVacaciones').textContent = formatCurrency(pagoVacaciones);
    document.getElementById('primaVacacional').textContent = formatCurrency(primaVacacional);
    document.getElementById('totalVacaciones').textContent = formatCurrency(totalVacaciones);
    document.getElementById('diasAguinaldo').textContent = diasAguinaldo.toFixed(2) + " días";
    document.getElementById('aguinaldo').textContent = formatCurrency(aguinaldo);
    
    // Mostrar sección de resultados
    document.getElementById('resultados').classList.remove('hidden');
}
function calcularDiasVacaciones(diasTrabajados) {
    let diasVacaciones = 0;
    let rangoActual = 0;

    // Calcular años completos de trabajo
    const añosCompletos = Math.floor(diasTrabajados / 365);

    // Usar los días de vacaciones correspondientes al año completo más reciente
    for (let i = 0; i < tablaVacacionesData.length; i++) {
        const añoVacaciones = i + 1;

        if (añosCompletos === 0 && diasTrabajados <= 365) {
            // Si no ha cumplido el primer año, darle solo los 6 días proporcionales
            const proporcion = diasTrabajados / 365;
            diasVacaciones = 6 * proporcion;
            rangoActual = 0;
            break;
        }

        if (añosCompletos >= añoVacaciones && añosCompletos < añoVacaciones + 1) {
            diasVacaciones = tablaVacacionesData[i].dias;
            rangoActual = i;
            break;
        }

        // Para más de 14 años
        if (añosCompletos >= 14) {
            diasVacaciones = tablaVacacionesData[13].dias;
            rangoActual = 13;
            break;
        }
    }

    return {
        diasVacaciones,
        rangoActual
    };
}
function resaltarRangoVacaciones(indice) {
    const filas = document.querySelectorAll('#tablaVacaciones tr');
    
    // Quitar resaltado de todas las filas
    filas.forEach(fila => {
        fila.style.backgroundColor = '';
        fila.style.fontWeight = '';
    });
    
    // Resaltar fila actual si existe
    if (filas[indice]) {
        filas[indice].style.backgroundColor = '#e3f2fd';
        filas[indice].style.fontWeight = 'bold';
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-MX', { 
        style: 'currency', 
        currency: 'MXN'
    }).format(value);
}