/* ==========================================================================
   LÓGICA: CÁLCULO DE PRESTACIONES LABORALES (REPÚBLICA DOMINICANA)
   ========================================================================== */

/**
 * Calcula las prestaciones laborales e indemnizaciones correspondientes.
 * Basado en el Código de Trabajo de la República Dominicana (Ley 16-92).
 */
function calcularPrestacionesLaborales() {
    const fechaIngresoInput = document.getElementById("lab-ingreso").value;
    const fechaSalidaInput = document.getElementById("lab-salida").value;
    const salarioMensual = parseFloat(document.getElementById("lab-salario").value);
    const motivoSelect = document.getElementById("lab-motivo").value;
    const preavisoDado = document.getElementById("lab-preaviso-dado").checked;
    const vacacionesTomadas = document.getElementById("lab-vacaciones-tomadas").checked;

    if (!fechaIngresoInput || !fechaSalidaInput || isNaN(salarioMensual) || salarioMensual <= 0) {
        alert("Por favor, introduzca fechas válidas y un salario mensual mayor a 0.");
        return;
    }

    // Fechas
    const [inYr, inMo, inDy] = fechaIngresoInput.split("-").map(Number);
    const [outYr, outMo, outDy] = fechaSalidaInput.split("-").map(Number);
    
    const fechaIngreso = new Date(inYr, inMo - 1, inDy);
    const fechaSalida = new Date(outYr, outMo - 1, outDy);

    if (fechaSalida < fechaIngreso) {
        alert("La fecha de salida no puede ser anterior a la fecha de ingreso.");
        return;
    }

    // 1. Calcular tiempo de servicio exacto en Años, Meses y Días
    let años = outYr - inYr;
    let meses = outMo - inMo;
    let dias = outDy - inDy;

    if (dias < 0) {
        meses--;
        // Días en el mes anterior
        const prevMonth = new Date(outYr, outMo - 1, 0).getDate();
        dias += prevMonth;
    }
    if (meses < 0) {
        años--;
        meses += 12;
    }

    const mesesTotales = (años * 12) + meses;
    const totalDiasServicio = Math.floor((fechaSalida - fechaIngreso) / (1000 * 60 * 60 * 24)) + 1;

    // 2. Determinar salario diario (Art. 85 del Código de Trabajo: salario mensual / 23.83)
    const factorDiario = 23.83;
    const salarioDiario = salarioMensual / factorDiario;

    // Inicializar rubros
    let diasPreaviso = 0;
    let diasCesantia = 0;
    let diasVacaciones = 0;
    let montoPreaviso = 0;
    let montoCesantia = 0;
    let montoVacaciones = 0;
    let montoNavidad = 0;

    // Derechos adquiridos aplican siempre:
    // A. Salario de Navidad Proporcional (Art. 219)
    // Se calcula sobre el tiempo trabajado en el año calendario corriente (del 1 de Enero al 31 de Diciembre)
    const yearStart = new Date(fechaSalida.getFullYear(), 0, 1);
    const inicioCalculoNavidad = fechaIngreso > yearStart ? fechaIngreso : yearStart;
    const diasTrabajadosEsteAño = Math.max(0, Math.floor((fechaSalida - inicioCalculoNavidad) / (1000 * 60 * 60 * 24)) + 1);
    
    // Proporcional de navidad: (Salario mensual / 365) * días trabajados este año
    // O equivalentemente: (Salario mensual / 12) * (meses proporcionales)
    montoNavidad = (salarioMensual / 365) * diasTrabajadosEsteAño;

    // B. Vacaciones Proporcionales (Art. 177, 180)
    // Si no ha tomado vacaciones en el último año de servicio, se pagan según escala
    if (!vacacionesTomadas) {
        if (mesesTotales >= 12) {
            // Trabajador con más de un año de servicio continuo
            const fraccionMeses = mesesTotales % 12;
            
            // Vacaciones acumuladas del último año completo
            diasVacaciones = años >= 5 ? 18 : 14;

            // Más la proporción del año en curso si supera los 5 meses (Art. 180)
            if (fraccionMeses >= 5) {
                diasVacaciones += obtenerDiasVacacionesProporcional(fraccionMeses);
            }
        } else {
            // Trabajador con menos de un año de servicio (debe tener al menos 5 meses para tener proporción)
            if (mesesTotales >= 5) {
                diasVacaciones = obtenerDiasVacacionesProporcional(mesesTotales);
            }
        }
        montoVacaciones = diasVacaciones * salarioDiario;
    }

    // Indemnizaciones (Preaviso y Cesantía)
    // Aplican en: Desahucio por el empleador (Despido Injustificado) y Dimisión Justificada.
    // NO aplican en: Despido Justificado y Renuncia (Desahucio por el trabajador).
    const aplicaIndemnizacion = (motivoSelect === "desahucio-patronal" || motivoSelect === "dimision-justificada");

    if (aplicaIndemnizacion) {
        // C. Preaviso (Art. 76)
        if (!preavisoDado) {
            if (mesesTotales >= 3 && mesesTotales < 6) {
                diasPreaviso = 7;
            } else if (mesesTotales >= 6 && mesesTotales < 12) {
                diasPreaviso = 14;
            } else if (mesesTotales >= 12) {
                diasPreaviso = 28;
            }
            montoPreaviso = diasPreaviso * salarioDiario;
        }

        // D. Auxilio de Cesantía (Art. 80)
        if (mesesTotales >= 3 && mesesTotales < 6) {
            diasCesantia = 6;
        } else if (mesesTotales >= 6 && mesesTotales < 12) {
            diasCesantia = 13;
        } else if (mesesTotales >= 12) {
            // De 1 a 5 años: 21 días por cada año.
            // De 5 años en adelante: 23 días por cada año.
            const factorCesantiaAnual = años >= 5 ? 23 : 21;
            diasCesantia = años * factorCesantiaAnual;

            // Proporción de la fracción del último año
            const fraccionMeses = mesesTotales % 12;
            if (fraccionMeses >= 3 && fraccionMeses < 6) {
                diasCesantia += 6;
            } else if (fraccionMeses >= 6 && fraccionMeses < 12) {
                diasCesantia += 13;
            }
        }
        montoCesantia = diasCesantia * salarioDiario;
    }

    const totalPrestaciones = montoPreaviso + montoCesantia + montoVacaciones + montoNavidad;

    // Pintar los resultados en pantalla
    mostrarResultadosPrestaciones({
        tiempoServicio: `${años} años, ${meses} meses y ${dias} días`,
        totalDiasServicio,
        salarioDiario,
        diasPreaviso,
        montoPreaviso,
        diasCesantia,
        montoCesantia,
        diasVacaciones,
        montoVacaciones,
        montoNavidad,
        totalPrestaciones,
        motivoText: obtenerMotivoTexto(motivoSelect),
        aplicaIndemnizacion
    });
}

/**
 * Escala proporcional de vacaciones según Art. 180 del Código de Trabajo RD.
 */
function obtenerDiasVacacionesProporcional(meses) {
    switch (meses) {
        case 5: return 6;
        case 6: return 7;
        case 7: return 8;
        case 8: return 9;
        case 9: return 10;
        case 10: return 11;
        case 11: return 12;
        default: return 0;
    }
}

/**
 * Retorna descripción legible del motivo.
 */
function obtenerMotivoTexto(motivo) {
    switch (motivo) {
        case "desahucio-patronal": return "Desahucio del Empleador (Despido Injustificado / Liquidación)";
        case "despido-justificado": return "Despido Justificado (Con Causa - Solo Derechos Adquiridos)";
        case "dimision-justificada": return "Dimisión Justificada (Renuncia Justificada con Prestaciones)";
        case "renuncia": return "Renuncia Ordinaria / Desahucio del Trabajador (Solo Derechos Adquiridos)";
        default: return "";
    }
}

/**
 * Renderiza los resultados en el panel correspondiente.
 */
function mostrarResultadosPrestaciones(res) {
    const resultsCard = document.getElementById("prestaciones-results");
    resultsCard.classList.add("active");

    // Inyectar datos
    document.getElementById("res-lab-servicio").innerText = res.tiempoServicio;
    document.getElementById("res-lab-salario-diario").innerText = `RD$ ${res.salarioDiario.toFixed(2)}`;
    document.getElementById("res-lab-motivo").innerText = res.motivoText;

    // Preaviso
    document.getElementById("res-lab-preaviso").innerText = `RD$ ${res.montoPreaviso.toFixed(2)}`;
    document.getElementById("res-lab-preaviso-dias").innerText = `(${res.diasPreaviso} días)`;

    // Cesantía
    document.getElementById("res-lab-cesantia").innerText = `RD$ ${res.montoCesantia.toFixed(2)}`;
    document.getElementById("res-lab-cesantia-dias").innerText = `(${res.diasCesantia} días)`;

    // Vacaciones
    document.getElementById("res-lab-vacaciones").innerText = `RD$ ${res.montoVacaciones.toFixed(2)}`;
    document.getElementById("res-lab-vacaciones-dias").innerText = `(${res.diasVacaciones} días)`;

    // Navidad
    document.getElementById("res-lab-navidad").innerText = `RD$ ${res.montoNavidad.toFixed(2)}`;

    // Total General
    document.getElementById("res-lab-total").innerText = `RD$ ${res.totalPrestaciones.toFixed(2)}`;

    // Mostrar u ocultar aclaraciones según el caso
    const avisoCesantíaInfo = document.getElementById("res-lab-aclaracion");
    if (!res.aplicaIndemnizacion) {
        avisoCesantíaInfo.style.display = "block";
        avisoCesantíaInfo.innerHTML = "<strong>Nota Importante:</strong> Debido a que el contrato terminó por Despido Justificado o Renuncia del Trabajador, <strong>no aplican</strong> los conceptos de Preaviso ni Auxilio de Cesantía en cumplimiento del Código de Trabajo. El monto mostrado corresponde exclusivamente a sus Derechos Adquiridos acumulados (Vacaciones y Salario de Navidad).";
    } else {
        avisoCesantíaInfo.style.display = "none";
    }
}

// Escuchas de eventos
document.addEventListener("DOMContentLoaded", () => {
    const btnCalcular = document.getElementById("btn-calcular-prestaciones");
    if (btnCalcular) {
        btnCalcular.addEventListener("click", calcularPrestacionesLaborales);
    }
});
