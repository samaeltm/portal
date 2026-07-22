/* ==========================================================================
   LÓGICA: CALCULADORA DE INTERESES DE DEMORA E INDEXACIÓN (RD)
   ========================================================================== */

/**
 * Realiza el cálculo de intereses legales/judiciales de demora y la indexación de capital.
 */
function calcularInteresesEIndexacion() {
    const capital = parseFloat(document.getElementById("int-capital").value);
    const fechaInicioInput = document.getElementById("int-inicio").value;
    const fechaFinInput = document.getElementById("int-fin").value;
    const tipoTasa = document.getElementById("int-tipo-tasa").value; // "judicial" | "anual-manual" | "mensual-manual"
    const tasaValorInput = parseFloat(document.getElementById("int-tasa-valor").value);
    const aplicarIndexacion = document.getElementById("int-indexar").checked;
    const inflacionValorInput = parseFloat(document.getElementById("int-inflacion-valor").value);

    if (isNaN(capital) || capital <= 0 || !fechaInicioInput || !fechaFinInput) {
        alert("Por favor, rellene el capital (mayor a 0) y los rangos de fecha.");
        return;
    }

    const [inYr, inMo, inDy] = fechaInicioInput.split("-").map(Number);
    const [outYr, outMo, outDy] = fechaFinInput.split("-").map(Number);
    
    const fechaInicio = new Date(inYr, inMo - 1, inDy);
    const fechaFin = new Date(outYr, outMo - 1, outDy);

    if (fechaFin < fechaInicio) {
        alert("La fecha final no puede ser anterior a la fecha de inicio.");
        return;
    }

    // Calcular días exactos transcurridos
    const msDiferencia = fechaFin - fechaInicio;
    const diasTranscurridos = Math.floor(msDiferencia / (1000 * 60 * 60 * 24));

    // Determinar la tasa anual aplicable
    let tasaAnual = 0;
    let tasaMensual = 0;
    let tasaExplicacion = "";

    if (tipoTasa === "judicial") {
        tasaMensual = 1.5; // 1.5% mensual estándar en tribunales de RD
        tasaAnual = tasaMensual * 12; // 18% anual
        tasaExplicacion = "Tasa Judicial Usual aplicada por tribunales en la RD (1.5% mensual / 18% anual).";
    } else if (tipoTasa === "anual-manual") {
        tasaAnual = isNaN(tasaValorInput) ? 12 : tasaValorInput;
        tasaMensual = tasaAnual / 12;
        tasaExplicacion = `Tasa anual personalizada del ${tasaAnual.toFixed(2)}% (${tasaMensual.toFixed(2)}% mensual).`;
    } else if (tipoTasa === "mensual-manual") {
        tasaMensual = isNaN(tasaValorInput) ? 1 : tasaValorInput;
        tasaAnual = tasaMensual * 12;
        tasaExplicacion = `Tasa mensual personalizada del ${tasaMensual.toFixed(2)}% (${tasaAnual.toFixed(2)}% anual).`;
    }

    // Calcular Intereses de Demora (Simple Interest formula: I = C * i * t)
    // C = Capital
    // i = Tasa diaria (tasa anual / 365)
    // t = Días transcurridos
    const tasaDiaria = (tasaAnual / 100) / 365.25; // usando año bisiesto promedio
    const montoIntereses = capital * tasaDiaria * diasTranscurridos;

    // Calcular Indexación por Inflación (Pérdida de poder adquisitivo)
    // Se suele liquidar basándose en el IPC, simulamos una indexación proporcional acumulada anualizada
    let montoIndexacion = 0;
    let inflacionExplicacion = "No aplicada.";

    if (aplicarIndexacion) {
        const inflacionAnual = isNaN(inflacionValorInput) ? 4.5 : inflacionValorInput; // 4.5% promedio de meta inflación en RD
        const inflacionDiaria = (inflacionAnual / 100) / 365.25;
        montoIndexacion = capital * inflacionDiaria * diasTranscurridos;
        inflacionExplicacion = `Indexación del capital ajustado a una inflación anual estimada del ${inflacionAnual.toFixed(2)}%.`;
    }

    const totalLiquidado = capital + montoIntereses + montoIndexacion;

    // Renderizar resultados en pantalla
    mostrarResultadosIntereses({
        capital,
        diasTranscurridos,
        aniosEquivalentes: (diasTranscurridos / 365.25).toFixed(2),
        tasaExplicacion,
        montoIntereses,
        inflacionExplicacion,
        montoIndexacion,
        totalLiquidado
    });
}

/**
 * Renderiza los resultados en el panel de intereses.
 */
function mostrarResultadosIntereses(res) {
    const resultsCard = document.getElementById("intereses-results");
    resultsCard.classList.add("active");

    document.getElementById("res-int-dias").innerText = `${res.diasTranscurridos} días (~${res.aniosEquivalentes} años)`;
    document.getElementById("res-int-tasa-desc").innerText = res.tasaExplicacion;
    document.getElementById("res-int-capital").innerText = `RD$ ${res.capital.toFixed(2)}`;
    document.getElementById("res-int-intereses").innerText = `RD$ ${res.montoIntereses.toFixed(2)}`;
    
    // Indexación
    const indexacionContainer = document.getElementById("res-int-indexacion-container");
    if (res.montoIndexacion > 0) {
        indexacionContainer.style.display = "flex";
        document.getElementById("res-int-indexacion").innerText = `RD$ ${res.montoIndexacion.toFixed(2)}`;
        document.getElementById("res-int-indexacion-desc").innerText = `(${res.inflacionExplicacion})`;
    } else {
        indexacionContainer.style.display = "none";
    }

    // Total General
    document.getElementById("res-int-total").innerText = `RD$ ${res.totalLiquidado.toFixed(2)}`;
}

// Escuchas de eventos e interacciones de formularios
document.addEventListener("DOMContentLoaded", () => {
    const btnCalcular = document.getElementById("btn-calcular-intereses");
    const selectTipoTasa = document.getElementById("int-tipo-tasa");
    const containerTasaManual = document.getElementById("int-tasa-manual-container");
    const checkboxIndexar = document.getElementById("int-indexar");
    const containerInflacion = document.getElementById("int-inflacion-container");

    if (btnCalcular) {
        btnCalcular.addEventListener("click", calcularInteresesEIndexacion);
    }

    // Ocultar/Mostrar input de tasa manual según selección
    if (selectTipoTasa && containerTasaManual) {
        selectTipoTasa.addEventListener("change", () => {
            if (selectTipoTasa.value === "judicial") {
                containerTasaManual.style.display = "none";
            } else {
                containerTasaManual.style.display = "flex";
                const label = containerTasaManual.querySelector("label");
                if (selectTipoTasa.value === "anual-manual") {
                    label.innerText = "Tasa Anual (%):";
                    document.getElementById("int-tasa-valor").value = "12";
                } else {
                    label.innerText = "Tasa Mensual (%):";
                    document.getElementById("int-tasa-valor").value = "1.5";
                }
            }
        });
    }

    // Ocultar/Mostrar inflación según checkbox
    if (checkboxIndexar && containerInflacion) {
        checkboxIndexar.addEventListener("change", () => {
            if (checkboxIndexar.checked) {
                containerInflacion.style.display = "flex";
            } else {
                containerInflacion.style.display = "none";
            }
        });
    }
});
