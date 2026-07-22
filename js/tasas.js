/* ==========================================================================
   LÓGICA: CALCULADORA DE TASAS JUDICIALES E IMPUESTOS DE REGISTRO (RD)
   ========================================================================== */

/**
 * Realiza el cálculo de tasas judiciales, impuestos de transferencia y registro en RD.
 */
function calcularTasasEImpuestos() {
    const tipoActo = document.getElementById("tas-tipo-acto").value;
    const valor = parseFloat(document.getElementById("tas-valor").value) || 0;
    
    // Inicializar desglose
    let impuestoMonto = 0;
    let impuestoDetalle = "";
    let tasaRegistroMonto = 0;
    let tasaRegistroDetalle = "";
    let sellosMonto = 0;
    let sellosDetalle = "";
    
    if (tipoActo !== "civil-sin-cuantia" && (isNaN(valor) || valor <= 0)) {
        alert("Por favor, introduzca un valor o monto del acto mayor a 0.");
        return;
    }

    switch (tipoActo) {
        case "transferencia-inmobiliaria":
            // 3% de impuesto de transferencia inmobiliaria (DGII - Ley 173-07)
            impuestoMonto = valor * 0.03;
            impuestoDetalle = "Impuesto de Transferencia Inmobiliaria (DGII) - 3.00% s/ valor";
            
            // Tasas de Registro de Títulos (Registro Inmobiliario)
            tasaRegistroMonto = 2000; // Tasa por emisión de nuevo Certificado de Título duplicado del dueño
            tasaRegistroDetalle = "Registro de Títulos (Expedición de Nuevo Certificado)";
            
            // Sellos y tasas misceláneas (Obras Públicas, Cruz Roja, etc.)
            sellosMonto = 1200;
            sellosDetalle = "Sellos Judiciales y Tasas por Servicios del Registro Inmobiliario";
            break;

        case "constitucion-hipoteca":
            // 2% sobre el monto garantizado por la hipoteca (DGII)
            impuestoMonto = valor * 0.02;
            impuestoDetalle = "Impuesto sobre Registro de Hipotecas (DGII) - 2.00% s/ monto garantizado";
            
            tasaRegistroMonto = 1000;
            tasaRegistroDetalle = "Registro de Títulos (Certificación de Registro de Acreedor)";
            
            sellosMonto = 1000;
            sellosDetalle = "Sellos Judiciales y Tasas por Servicios de Hipotecas";
            break;

        case "venta-vehiculo":
            // 2% del valor de venta o de tabla DGII (Impuesto por Traspaso)
            impuestoMonto = valor * 0.02;
            impuestoDetalle = "Impuesto por Traspaso de Vehículo de Motor (DGII) - 2.00% s/ valor";
            
            tasaRegistroMonto = 1000;
            tasaRegistroDetalle = "Tasa por Emisión de Nueva Matrícula";
            
            sellosMonto = 500;
            sellosDetalle = "Sellos y Trámites ante la DGII";
            break;

        case "civil-con-cuantia":
            // 1% por el Registro Civil del ayuntamiento correspondiente (Ley 2334)
            impuestoMonto = valor * 0.01;
            impuestoDetalle = "Impuesto de Registro Civil de Actos bajo Firma Privada (Conservaduría) - 1.00% s/ monto";
            
            tasaRegistroMonto = 500;
            tasaRegistroDetalle = "Derecho de Registro Civil (Ayuntamiento)";
            
            sellosMonto = 200;
            sellosDetalle = "Sellos de Notaría y Leyes Adicionales";
            break;

        case "civil-sin-cuantia":
            // Fijo para actas que no conllevan monto económico (ej: poderes, declaraciones)
            impuestoMonto = 0;
            impuestoDetalle = "No aplica impuesto porcentual por carecer de cuantía económica";
            
            tasaRegistroMonto = 500; // Tasa única fija en el ayuntamiento
            tasaRegistroDetalle = "Tasa Fija de Registro Civil (Acto sin cuantía)";
            
            sellosMonto = 100;
            sellosDetalle = "Stickers de Notario / Colegio de Abogados";
            break;
    }

    const totalGeneral = impuestoMonto + tasaRegistroMonto + sellosMonto;

    // Pintar resultados
    mostrarResultadosTasas({
        tipoActoText: obtenerTipoActoTexto(tipoActo),
        montoDeclarado: valor,
        impuestoMonto,
        impuestoDetalle,
        tasaRegistroMonto,
        tasaRegistroDetalle,
        sellosMonto,
        sellosDetalle,
        totalGeneral
    });
}

/**
 * Traduce el tipo de acto a texto legible.
 */
function obtenerTipoActoTexto(tipo) {
    switch (tipo) {
        case "transferencia-inmobiliaria": return "Transferencia Inmobiliaria (Venta de Inmuebles)";
        case "constitucion-hipoteca": return "Constitución de Hipoteca";
        case "venta-vehiculo": return "Transferencia de Vehículos de Motor";
        case "civil-con-cuantia": return "Registro de Contratos Civiles/Comerciales Con Cuantía (Alquiler, Transacción)";
        case "civil-sin-cuantia": return "Registro de Actos Civiles Sin Cuantía (Poderes, Declaraciones)";
        default: return "";
    }
}

/**
 * Pinta resultados de tasas en la UI.
 */
function mostrarResultadosTasas(res) {
    const resultsCard = document.getElementById("tasas-results");
    resultsCard.classList.add("active");

    document.getElementById("res-tas-tipo").innerText = res.tipoActoText;
    document.getElementById("res-tas-valor").innerText = `RD$ ${res.montoDeclarado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Desglose
    document.getElementById("res-tas-impuesto").innerText = `RD$ ${res.impuestoMonto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("res-tas-impuesto-desc").innerText = res.impuestoDetalle;

    document.getElementById("res-tas-registro").innerText = `RD$ ${res.tasaRegistroMonto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("res-tas-registro-desc").innerText = res.tasaRegistroDetalle;

    document.getElementById("res-tas-sellos").innerText = `RD$ ${res.sellosMonto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("res-tas-sellos-desc").innerText = res.sellosDetalle;

    // Total
    document.getElementById("res-tas-total").innerText = `RD$ ${res.totalGeneral.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Escucha de eventos
document.addEventListener("DOMContentLoaded", () => {
    const btnCalcular = document.getElementById("btn-calcular-tasas");
    const selectTipoActo = document.getElementById("tas-tipo-acto");
    const valInputContainer = document.getElementById("tas-valor-container");

    if (btnCalcular) {
        btnCalcular.addEventListener("click", calcularTasasEImpuestos);
    }

    if (selectTipoActo && valInputContainer) {
        selectTipoActo.addEventListener("change", () => {
            const label = valInputContainer.querySelector("label");
            if (selectTipoActo.value === "civil-sin-cuantia") {
                valInputContainer.style.display = "none";
            } else {
                valInputContainer.style.display = "flex";
                if (selectTipoActo.value === "transferencia-inmobiliaria" || selectTipoActo.value === "venta-vehiculo") {
                    label.innerText = "Valor del Bien Declarado en el Contrato (RD$):";
                } else if (selectTipoActo.value === "constitucion-hipoteca") {
                    label.innerText = "Monto de la Hipoteca Garantizada (RD$):";
                } else {
                    label.innerText = "Cuantía Económica del Contrato (RD$):";
                }
            }
        });
    }
});
