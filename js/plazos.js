/* ==========================================================================
   LÓGICA: CALCULADORA DE PLAZOS PROCESALES (REPÚBLICA DOMINICANA)
   ========================================================================== */

/**
 * Calcula la fecha de Pascua (Domingo de Resurrección) para un año dado.
 * Algoritmo de Meeus/Jones/Butcher.
 */
function getEasterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = Marzo, 4 = Abril
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

/**
 * Aplica la Ley 139-97 sobre el traslado de días feriados en República Dominicana.
 * - Si cae martes o miércoles, se traslada al lunes anterior.
 * - Si cae jueves o viernes, se traslada al lunes siguiente.
 * - Si cae sábado, domingo o lunes, se queda en su día original.
 */
function getMovableHoliday(year, month, day) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    
    let movedDate = new Date(date);
    if (dayOfWeek === 2) { // Martes
        movedDate.setDate(date.getDate() - 1); // Lunes anterior
    } else if (dayOfWeek === 3) { // Miércoles
        movedDate.setDate(date.getDate() - 2); // Lunes anterior
    } else if (dayOfWeek === 4) { // Jueves
        movedDate.setDate(date.getDate() + 4); // Lunes siguiente
    } else if (dayOfWeek === 5) { // Viernes
        movedDate.setDate(date.getDate() + 3); // Lunes siguiente
    }
    return movedDate;
}

/**
 * Retorna la lista de festivos oficiales de República Dominicana para un año.
 */
function getDRHolidays(year) {
    const holidays = [];

    // 1. Año Nuevo (1 de Enero) - Inamovible
    holidays.push({ date: new Date(year, 0, 1), name: "Año Nuevo" });

    // 2. Día de los Santos Reyes (6 de Enero) - Movible por Ley 139-97
    const reyes = getMovableHoliday(year, 0, 6);
    holidays.push({ date: reyes, name: "Día de los Reyes Magos" });

    // 3. Día de la Altagracia (21 de Enero) - Inamovible (Fiesta Religiosa)
    holidays.push({ date: new Date(year, 0, 21), name: "Día de Nuestra Señora de la Altagracia" });

    // 4. Día del Patricio Juan Pablo Duarte (26 de Enero) - Movible por Ley 139-97
    const duarte = getMovableHoliday(year, 0, 26);
    holidays.push({ date: duarte, name: "Día del Patricio Juan Pablo Duarte" });

    // 5. Día de la Independencia Nacional (27 de Febrero) - Inamovible
    holidays.push({ date: new Date(year, 1, 27), name: "Día de la Independencia Nacional" });

    // 6. Viernes Santo - Variable
    const easter = getEasterSunday(year);
    const viernesSanto = new Date(easter);
    viernesSanto.setDate(easter.getDate() - 2);
    holidays.push({ date: viernesSanto, name: "Viernes Santo" });

    // 7. Día del Trabajo (1 de Mayo) - Movible por Ley 139-97
    const trabajo = getMovableHoliday(year, 4, 1);
    holidays.push({ date: trabajo, name: "Día del Trabajo" });

    // 8. Corpus Christi (Jueves posterior) - Variable (60 días después de Pascua)
    const corpus = new Date(easter);
    corpus.setDate(easter.getDate() + 60);
    holidays.push({ date: corpus, name: "Día de Corpus Christi" });

    // 9. Día de la Restauración (16 de Agosto) - Inamovible (constitucionalmente fijo)
    holidays.push({ date: new Date(year, 7, 16), name: "Día de la Restauración" });

    // 10. Día de Nuestra Señora de las Mercedes (24 de Septiembre) - Inamovible
    holidays.push({ date: new Date(year, 8, 24), name: "Día de Nuestra Señora de las Mercedes" });

    // 11. Día de la Constitución (6 de Noviembre) - Movible por Ley 139-97
    const constitucion = getMovableHoliday(year, 10, 6);
    holidays.push({ date: constitucion, name: "Día de la Constitución" });

    // 12. Día de Navidad (25 de Diciembre) - Inamovible
    holidays.push({ date: new Date(year, 11, 25), name: "Día de Navidad" });

    return holidays;
}

/**
 * Comprueba si una fecha es festivo en la República Dominicana.
 */
function isDRHoliday(date, holidaysList) {
    const dStr = date.toDateString();
    return holidaysList.find(h => h.date.toDateString() === dStr);
}

/**
 * Da formato de fecha en español dominicano.
 */
function formatDateSpanish(date) {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

/**
 * Ejecuta el cálculo de plazos.
 */
function calcularPlazoProcesal() {
    // Obtener valores del formulario
    const fechaInicioInput = document.getElementById("fecha-inicio").value;
    const plazoCantidad = parseInt(document.getElementById("plazo-cantidad").value, 10);
    const plazoUnidad = document.getElementById("plazo-unidad").value; // "dias" | "meses"
    const plazoTipo = document.getElementById("plazo-tipo").value; // "habiles" | "naturales"
    const plazoFranco = document.getElementById("plazo-franco").checked;

    if (!fechaInicioInput || isNaN(plazoCantidad) || plazoCantidad <= 0) {
        alert("Por favor, introduzca una fecha de inicio válida y una cantidad de plazo mayor a 0.");
        return;
    }

    // Fecha base (convertir a objeto Date local)
    // El input tipo date devuelve "YYYY-MM-DD" en UTC. Hay que convertir a hora local para evitar desfases.
    const [year, month, day] = fechaInicioInput.split("-").map(Number);
    let currentDate = new Date(year, month - 1, day);
    const originalStartDate = new Date(currentDate);

    // Logs de cálculo
    const log = [];
    let holidaysCache = {};

    const getHolidaysForYear = (yr) => {
        if (!holidaysCache[yr]) {
            holidaysCache[yr] = getDRHolidays(yr);
        }
        return holidaysCache[yr];
    };

    let totalDaysAdded = plazoCantidad;
    let explanationFranco = "";

    // Si es plazo franco en civil dominicano, se excluye el dies a quo (notificación) y dies ad quem (vencimiento)
    // En la práctica judicial, esto se computa agregando 2 días al plazo total.
    if (plazoFranco) {
        totalDaysAdded += 2;
        explanationFranco = "Se añadieron 2 días adicionales por concepto de Plazo Franco (exclusión del primer y último día del conteo).";
    }

    let finalDate = new Date(originalStartDate);
    let countedCount = 0;
    
    // El conteo procesal inicia al día siguiente de la notificación (dies a quo)
    // Avanzamos 1 día antes de empezar el bucle de conteo
    currentDate.setDate(currentDate.getDate() + 1);

    if (plazoUnidad === "dias") {
        if (plazoTipo === "naturales") {
            // Días naturales: se suman correlativamente todos los días.
            for (let i = 0; i < totalDaysAdded; i++) {
                const dayOfWeek = currentDate.getDay();
                const yr = currentDate.getFullYear();
                const holidays = getHolidaysForYear(yr);
                const holidayInfo = isDRHoliday(currentDate, holidays);

                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    log.push({
                        date: new Date(currentDate),
                        status: "Fin de semana (Contado)",
                        type: "counted weekend",
                        desc: "Fin de semana"
                    });
                } else if (holidayInfo) {
                    log.push({
                        date: new Date(currentDate),
                        status: `Festivo: ${holidayInfo.name} (Contado)`,
                        type: "counted holiday",
                        desc: holidayInfo.name
                    });
                } else {
                    log.push({
                        date: new Date(currentDate),
                        status: "Día laborable (Contado)",
                        type: "counted",
                        desc: "Día hábil ordinario"
                    });
                }

                if (i === totalDaysAdded - 1) {
                    finalDate = new Date(currentDate);
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Prórroga de vencimiento en días naturales:
            // Si el último día cae en fin de semana o festivo, expira el primer día hábil siguiente
            let finalDayOfWeek = finalDate.getDay();
            let finalYr = finalDate.getFullYear();
            let finalHolidays = getHolidaysForYear(finalYr);
            let finalHolidayInfo = isDRHoliday(finalDate, finalHolidays);

            while (finalDayOfWeek === 0 || finalDayOfWeek === 6 || finalHolidayInfo) {
                let reason = (finalDayOfWeek === 0 || finalDayOfWeek === 6) ? "Fin de Semana" : `Festivo (${finalHolidayInfo.name})`;
                log.push({
                    date: new Date(finalDate),
                    status: `Vencimiento prorrogado por coincidir con ${reason}`,
                    type: "holiday",
                    desc: `Prórroga: ${reason}`
                });
                
                finalDate.setDate(finalDate.getDate() + 1);
                finalDayOfWeek = finalDate.getDay();
                finalYr = finalDate.getFullYear();
                finalHolidays = getHolidaysForYear(finalYr);
                finalHolidayInfo = isDRHoliday(finalDate, finalHolidays);
            }

        } else {
            // Días hábiles: solo se cuentan de lunes a viernes que no sean festivos.
            let i = 0;
            while (i < totalDaysAdded) {
                const dayOfWeek = currentDate.getDay();
                const yr = currentDate.getFullYear();
                const holidays = getHolidaysForYear(yr);
                const holidayInfo = isDRHoliday(currentDate, holidays);

                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    log.push({
                        date: new Date(currentDate),
                        status: "Fin de semana (Excluido)",
                        type: "weekend",
                        desc: "Sábado/Domingo inhábil"
                    });
                } else if (holidayInfo) {
                    log.push({
                        date: new Date(currentDate),
                        status: `Festivo: ${holidayInfo.name} (Excluido)`,
                        type: "holiday",
                        desc: holidayInfo.name
                    });
                } else {
                    log.push({
                        date: new Date(currentDate),
                        status: "Día hábil (Contado)",
                        type: "counted",
                        desc: `Día de plazo #${i + 1}`
                    });
                    i++;
                    if (i === totalDaysAdded) {
                        finalDate = new Date(currentDate);
                    }
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    } else {
        // Cómputo por meses (Art. 1033 del Código de Procedimiento Civil RD)
        // Se cuenta de fecha a fecha. Ej: Del 15 de enero al 15 de febrero.
        finalDate = new Date(originalStartDate);
        finalDate.setMonth(finalDate.getMonth() + totalDaysAdded);

        // Si vence en un día inexistente (ej. del 31 de agosto + 1 mes -> 31 de septiembre no existe),
        // se ajusta al último día de ese mes (30 de septiembre).
        if (finalDate.getDate() !== originalStartDate.getDate()) {
            finalDate.setDate(0); // Último día del mes anterior
        }

        log.push({
            date: new Date(finalDate),
            status: `Cálculo de fecha a fecha (${totalDaysAdded} meses)`,
            type: "counted",
            desc: `Suma directa de meses`
        });

        // Prórroga por día inhábil en el vencimiento del mes
        let finalDayOfWeek = finalDate.getDay();
        let finalYr = finalDate.getFullYear();
        let finalHolidays = getHolidaysForYear(finalYr);
        let finalHolidayInfo = isDRHoliday(finalDate, finalHolidays);

        while (finalDayOfWeek === 0 || finalDayOfWeek === 6 || finalHolidayInfo) {
            let reason = (finalDayOfWeek === 0 || finalDayOfWeek === 6) ? "Fin de Semana" : `Festivo (${finalHolidayInfo.name})`;
            log.push({
                date: new Date(finalDate),
                status: `Vencimiento prorrogado por coincidir con ${reason}`,
                type: "holiday",
                desc: `Prórroga: ${reason}`
            });
            
            finalDate.setDate(finalDate.getDate() + 1);
            finalDayOfWeek = finalDate.getDay();
            finalYr = finalDate.getFullYear();
            finalHolidays = getHolidaysForYear(finalYr);
            finalHolidayInfo = isDRHoliday(finalDate, finalHolidays);
        }
    }

    // Renderizar resultados en la interfaz
    mostrarResultadosPlazos(originalStartDate, finalDate, plazoCantidad, plazoUnidad, plazoTipo, plazoFranco, log, explanationFranco);
}

/**
 * Pinta los resultados calculados en el HTML.
 */
function mostrarResultadosPlazos(start, end, qty, unit, type, franco, log, explanation) {
    const resultsCard = document.getElementById("plazos-results");
    resultsCard.classList.add("active");

    document.getElementById("res-fecha-inicio").innerText = formatDateSpanish(start);
    document.getElementById("res-vencimiento").innerText = formatDateSpanish(end);
    document.getElementById("res-plazo-solicitado").innerText = `${qty} ${unit === 'dias' ? 'días' : 'meses'} (${type === 'habiles' ? 'Hábiles' : 'Naturales'})`;
    
    // Mensaje de aclaración sobre Plazo Franco
    const francoMsgElement = document.getElementById("res-franco-detalle");
    if (franco) {
        francoMsgElement.style.display = "block";
        francoMsgElement.innerHTML = `<strong>Plazo Franco Aplicado:</strong> ${explanation}`;
    } else {
        francoMsgElement.style.display = "none";
    }

    // Renderizar el log detallado de días
    const logList = document.getElementById("plazos-log-list");
    logList.innerHTML = "";

    log.forEach(item => {
        const li = document.createElement("div");
        li.className = `calendar-log-item ${item.type}`;
        
        const dateSpan = document.createElement("span");
        dateSpan.innerHTML = `<strong>${item.date.getDate()}/${item.date.getMonth()+1}/${item.date.getFullYear()}</strong> (${formatDateSpanish(item.date).split(',')[0]})`;
        
        const statusSpan = document.createElement("span");
        statusSpan.innerText = item.status;

        li.appendChild(dateSpan);
        li.appendChild(statusSpan);
        logList.appendChild(li);
    });
}

// Escuchas de eventos para inicialización
document.addEventListener("DOMContentLoaded", () => {
    // Establecer la fecha de hoy como valor por defecto del input
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    const fechaInicioInput = document.getElementById("fecha-inicio");
    if (fechaInicioInput) {
        fechaInicioInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Asignar el botón de cálculo
    const btnCalcular = document.getElementById("btn-calcular-plazos");
    if (btnCalcular) {
        btnCalcular.addEventListener("click", calcularPlazoProcesal);
    }
});
