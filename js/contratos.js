/* ==========================================================================
   LÓGICA: GENERADOR DE CONTRATOS LEGALES (REPÚBLICA DOMINICANA)
   Genera borradores de referencia basados en el marco legal dominicano.
   100% local — sin envío de datos al servidor.
   ========================================================================== */

// ──────────────────────────────────────────────────────────────────────────────
// PLANTILLAS DE CONTRATOS
// ──────────────────────────────────────────────────────────────────────────────

const PLANTILLAS_CONTRATOS = {

    "arrendamiento": {
        titulo: "Contrato de Arrendamiento de Inmueble",
        campos: [
            { id: "arr-arrendador-nombre",  label: "Nombre completo del Arrendador (propietario)",  tipo: "text",   placeholder: "Ej: Juan Antonio Pérez Martínez" },
            { id: "arr-arrendador-cedula",  label: "Cédula del Arrendador",                          tipo: "text",   placeholder: "Ej: 001-0000000-0" },
            { id: "arr-arrendatario-nombre",label: "Nombre completo del Arrendatario (inquilino)",   tipo: "text",   placeholder: "Ej: María Elena García López" },
            { id: "arr-arrendatario-cedula",label: "Cédula del Arrendatario",                        tipo: "text",   placeholder: "Ej: 001-0000001-1" },
            { id: "arr-inmueble",           label: "Descripción y Dirección del Inmueble",           tipo: "text",   placeholder: "Ej: Apartamento #2B, Edificio Las Palmas, Calle Duarte #45, Santo Domingo" },
            { id: "arr-uso",                label: "Uso del Inmueble",                               tipo: "select", opciones: ["Uso Residencial", "Uso Comercial", "Uso de Oficina Profesional"] },
            { id: "arr-canon",              label: "Canon de Arrendamiento Mensual (RD$)",           tipo: "number", placeholder: "Ej: 15000" },
            { id: "arr-deposito",           label: "Depósito de Garantía (RD$)",                     tipo: "number", placeholder: "Ej: 30000 (generalmente 2 meses)" },
            { id: "arr-duracion",           label: "Duración del Contrato",                          tipo: "select", opciones: ["6 meses", "1 año", "2 años", "3 años", "Tiempo Indefinido"] },
            { id: "arr-inicio",             label: "Fecha de Inicio del Contrato",                   tipo: "date",   placeholder: "" },
            { id: "arr-pago-dia",           label: "Día del mes para el pago del canon",             tipo: "number", placeholder: "Ej: 1, 5, 15" },
            { id: "arr-ciudad",             label: "Ciudad donde se suscribe el contrato",           tipo: "text",   placeholder: "Ej: Santo Domingo" },
            { id: "arr-fecha-firma",        label: "Fecha de Firma del Contrato",                    tipo: "date",   placeholder: "" },
        ],
        generar: (d) => {
            const hoy = formatearFechaLarga(d["arr-fecha-firma"]);
            const inicio = formatearFechaLarga(d["arr-inicio"]);
            return `
                <div class="contrato-preview-body">
                    <h2 class="contrato-titulo">${PLANTILLAS_CONTRATOS.arrendamiento.titulo.toUpperCase()}</h2>
                    <p class="contrato-subtitulo">República Dominicana</p>

                    <p>En la ciudad de <strong>${d["arr-ciudad"]}</strong>, República Dominicana, a los ${hoy}, comparecen:</p>

                    <p>De una parte, el señor(a) <strong>${d["arr-arrendador-nombre"]}</strong>, dominicano(a), mayor de edad, titular de la Cédula de Identidad y Electoral número <strong>${d["arr-arrendador-cedula"]}</strong>, en calidad de <strong>ARRENDADOR</strong>;</p>

                    <p>Y de la otra parte, el señor(a) <strong>${d["arr-arrendatario-nombre"]}</strong>, dominicano(a), mayor de edad, titular de la Cédula de Identidad y Electoral número <strong>${d["arr-arrendatario-cedula"]}</strong>, en calidad de <strong>ARRENDATARIO</strong>;</p>

                    <p>Ambas partes, en plena capacidad legal, convienen en celebrar el presente CONTRATO DE ARRENDAMIENTO, sujeto a las estipulaciones siguientes:</p>

                    <h4>PRIMERO: DEL INMUEBLE</h4>
                    <p>El ARRENDADOR da en arrendamiento al ARRENDATARIO, y este último acepta, el inmueble ubicado en: <strong>${d["arr-inmueble"]}</strong>, destinado exclusivamente para <strong>${d["arr-uso"]}</strong>.</p>

                    <h4>SEGUNDO: DEL CANON Y FORMA DE PAGO</h4>
                    <p>El ARRENDATARIO pagará al ARRENDADOR un canon mensual de <strong>RD$ ${parseFloat(d["arr-canon"]).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong> (${numeroALetras(parseFloat(d["arr-canon"]))} pesos dominicanos), pagadero dentro de los primeros <strong>${d["arr-pago-dia"]}</strong> días de cada mes, mediante depósito bancario, transferencia o cualquier medio acordado por las partes.</p>

                    <h4>TERCERO: DEL DEPÓSITO DE GARANTÍA</h4>
                    <p>El ARRENDATARIO entrega en este acto la suma de <strong>RD$ ${parseFloat(d["arr-deposito"]).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong> como depósito de garantía, el cual le será devuelto al término del contrato, previa verificación del estado del inmueble y siempre que no existan cánones pendientes ni daños imputables al ARRENDATARIO.</p>

                    <h4>CUARTO: DE LA DURACIÓN</h4>
                    <p>El presente contrato tendrá una duración de <strong>${d["arr-duracion"]}</strong>, a partir del <strong>${inicio}</strong>. Al vencimiento, si ninguna de las partes notifica con 30 días de anticipación su intención de no renovar, el contrato se entenderá renovado en las mismas condiciones.</p>

                    <h4>QUINTO: DE LAS OBLIGACIONES DEL ARRENDATARIO</h4>
                    <p>El ARRENDATARIO se obliga a: (a) pagar el canon en la fecha pactada; (b) conservar el inmueble en buen estado; (c) no subarrendar ni ceder el contrato sin autorización escrita del ARRENDADOR; (d) no destinar el inmueble a fines distintos al acordado; (e) notificar al ARRENDADOR sobre daños o averías que requieran reparación.</p>

                    <h4>SEXTO: DE LAS OBLIGACIONES DEL ARRENDADOR</h4>
                    <p>El ARRENDADOR se obliga a: (a) garantizar el uso pacífico del inmueble durante la vigencia del contrato; (b) realizar las reparaciones estructurales necesarias; (c) entregar el inmueble en las condiciones pactadas.</p>

                    <h4>SÉPTIMO: DE LA RESCISIÓN</h4>
                    <p>El presente contrato podrá rescindirse por: (a) incumplimiento de cualesquiera de las obligaciones pactadas; (b) uso del inmueble para fines distintos a los autorizados; (c) mutuo acuerdo entre las partes, con aviso escrito de 30 días. En caso de rescisión por causa imputable al ARRENDATARIO, este perderá el depósito de garantía.</p>

                    <h4>OCTAVO: DE LA LEY APLICABLE Y JURISDICCIÓN</h4>
                    <p>El presente contrato se rige por las disposiciones del Código Civil de la República Dominicana y la Ley No. 4314 sobre Arrendamientos. Para cualquier controversia derivada de este contrato, las partes se someten a los Tribunales competentes del Departamento Judicial de <strong>${d["arr-ciudad"]}</strong>.</p>

                    <div class="contrato-firmas">
                        <div class="firma-bloque">
                            <div class="firma-linea"></div>
                            <p><strong>${d["arr-arrendador-nombre"]}</strong></p>
                            <p>ARRENDADOR — Cédula: ${d["arr-arrendador-cedula"]}</p>
                        </div>
                        <div class="firma-bloque">
                            <div class="firma-linea"></div>
                            <p><strong>${d["arr-arrendatario-nombre"]}</strong></p>
                            <p>ARRENDATARIO — Cédula: ${d["arr-arrendatario-cedula"]}</p>
                        </div>
                    </div>
                    <p class="contrato-nota-legal">⚠️ Este documento es un borrador de referencia generado automáticamente con fines informativos. Debe ser revisado y autenticado por un Notario Público habilitado antes de su firma y registro. LexTools RD no asume responsabilidad por su uso.</p>
                </div>`;
        }
    },

    "trabajo": {
        titulo: "Contrato de Trabajo por Tiempo Indefinido",
        campos: [
            { id: "lab-empresa-nombre",    label: "Razón Social / Nombre del Empleador",          tipo: "text",   placeholder: "Ej: Empresa Comercial S.R.L." },
            { id: "lab-empresa-rnc",       label: "RNC / Cédula del Empleador",                   tipo: "text",   placeholder: "Ej: 1-30-00000-1" },
            { id: "lab-empresa-rep",       label: "Nombre del Representante Legal",                tipo: "text",   placeholder: "Ej: Carlos Jiménez Pérez" },
            { id: "lab-empresa-rep-cedula",label: "Cédula del Representante Legal",                tipo: "text",   placeholder: "Ej: 001-0000002-2" },
            { id: "lab-empresa-dir",       label: "Dirección de la Empresa",                       tipo: "text",   placeholder: "Ej: Av. Winston Churchill #15, Santo Domingo" },
            { id: "lab-empleado-nombre",   label: "Nombre completo del Trabajador",                tipo: "text",   placeholder: "Ej: Pedro Rafael González Ureña" },
            { id: "lab-empleado-cedula",   label: "Cédula del Trabajador",                         tipo: "text",   placeholder: "Ej: 001-0000003-3" },
            { id: "lab-cargo",             label: "Cargo o Puesto de Trabajo",                     tipo: "text",   placeholder: "Ej: Asistente Administrativo" },
            { id: "lab-departamento",      label: "Departamento / Área",                            tipo: "text",   placeholder: "Ej: Recursos Humanos" },
            { id: "lab-salario",           label: "Salario Mensual Bruto (RD$)",                   tipo: "number", placeholder: "Ej: 25000" },
            { id: "lab-horario",           label: "Horario de Trabajo",                             tipo: "select", opciones: ["Lunes a Viernes, 8:00 AM – 5:00 PM", "Lunes a Sábado, 8:00 AM – 12:00 PM", "Lunes a Viernes, 9:00 AM – 6:00 PM", "Rotativo / Por turnos según necesidad"] },
            { id: "lab-inicio-contrato",   label: "Fecha de Inicio del Contrato",                  tipo: "date",   placeholder: "" },
            { id: "lab-ciudad-firma",      label: "Ciudad donde se suscribe",                       tipo: "text",   placeholder: "Ej: Santiago de los Caballeros" },
            { id: "lab-fecha-firma",       label: "Fecha de Firma",                                 tipo: "date",   placeholder: "" },
        ],
        generar: (d) => {
            const hoy = formatearFechaLarga(d["lab-fecha-firma"]);
            const inicio = formatearFechaLarga(d["lab-inicio-contrato"]);
            const salario = parseFloat(d["lab-salario"]);
            return `
                <div class="contrato-preview-body">
                    <h2 class="contrato-titulo">${PLANTILLAS_CONTRATOS.trabajo.titulo.toUpperCase()}</h2>
                    <p class="contrato-subtitulo">República Dominicana — Código de Trabajo, Ley No. 16-92</p>

                    <p>En la ciudad de <strong>${d["lab-ciudad-firma"]}</strong>, a los ${hoy}, entre:</p>

                    <p><strong>EMPLEADOR:</strong> <strong>${d["lab-empresa-nombre"]}</strong>, con RNC/Cédula No. <strong>${d["lab-empresa-rnc"]}</strong>, con domicilio en <strong>${d["lab-empresa-dir"]}</strong>, representada en este acto por el señor(a) <strong>${d["lab-empresa-rep"]}</strong>, portador(a) de la C.I.E. No. <strong>${d["lab-empresa-rep-cedula"]}</strong>;</p>

                    <p><strong>TRABAJADOR:</strong> El señor(a) <strong>${d["lab-empleado-nombre"]}</strong>, dominicano(a), mayor de edad, titular de la C.I.E. No. <strong>${d["lab-empleado-cedula"]}</strong>;</p>

                    <p>Convienen celebrar el presente CONTRATO DE TRABAJO POR TIEMPO INDEFINIDO, conforme a las siguientes cláusulas:</p>

                    <h4>PRIMERO: DEL CARGO Y FUNCIONES</h4>
                    <p>El EMPLEADOR contrata al TRABAJADOR para desempeñar el cargo de <strong>${d["lab-cargo"]}</strong>, adscrito al Departamento de <strong>${d["lab-departamento"]}</strong>, con las funciones, responsabilidades y obligaciones inherentes a dicho cargo, así como las que le sean asignadas por sus superiores jerárquicos.</p>

                    <h4>SEGUNDO: DEL SALARIO</h4>
                    <p>El EMPLEADOR pagará al TRABAJADOR un salario mensual de <strong>RD$ ${salario.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong> (${numeroALetras(salario)} pesos dominicanos), pagadero de forma quincenal o mensual según la política de la empresa, mediante transferencia bancaria o cualquier medio legalmente reconocido.</p>

                    <h4>TERCERO: DEL HORARIO Y JORNADA</h4>
                    <p>El TRABAJADOR laborará bajo el siguiente horario: <strong>${d["lab-horario"]}</strong>, con derecho a los descansos y días feriados establecidos por ley. La jornada ordinaria no excederá de 8 horas diarias ni de 44 horas semanales, conforme al Código de Trabajo.</p>

                    <h4>CUARTO: DE LA FECHA DE INICIO</h4>
                    <p>El presente contrato inicia sus efectos el día <strong>${inicio}</strong> y tendrá vigencia indefinida, salvo terminación por las causas establecidas en el Código de Trabajo de la República Dominicana.</p>

                    <h4>QUINTO: DE LAS PRESTACIONES LABORALES</h4>
                    <p>El TRABAJADOR tendrá derecho a todas las prestaciones laborales establecidas por el Código de Trabajo: salario de Navidad proporcional (Ley No. 16-92, Art. 219), vacaciones anuales (Arts. 177-192), participación en beneficios (Art. 223), auxilio de cesantía, preaviso y demás derechos irrenunciables previstos por ley.</p>

                    <h4>SEXTO: DE LA SEGURIDAD SOCIAL</h4>
                    <p>El EMPLEADOR inscribirá al TRABAJADOR en el Sistema Dominicano de Seguridad Social (SDSS) conforme a la Ley No. 87-01, efectuando los aportes correspondientes al Seguro de Vejez, Discapacidad y Sobrevivencia (SFS) y al Seguro Familiar de Salud (SFS).</p>

                    <h4>SÉPTIMO: DE LA CONFIDENCIALIDAD</h4>
                    <p>El TRABAJADOR se obliga a mantener estricta confidencialidad sobre toda información, datos, procesos y secretos comerciales del EMPLEADOR a los que tenga acceso con motivo de su trabajo, tanto durante la vigencia del contrato como con posterioridad a su terminación.</p>

                    <h4>OCTAVO: DE LA TERMINACIÓN</h4>
                    <p>Este contrato podrá terminarse por: desahucio (con preaviso legal), despido justificado por causa prevista en el Art. 88 del Código de Trabajo, dimisión justificada del trabajador, o mutuo acuerdo de las partes. En cada caso, se aplicarán las indemnizaciones y procedimientos previstos por el Código de Trabajo.</p>

                    <h4>NOVENO: LEY APLICABLE Y JURISDICCIÓN</h4>
                    <p>El presente contrato se rige íntegramente por el Código de Trabajo de la República Dominicana (Ley No. 16-92). Las controversias se dirimirán ante el Tribunal Laboral competente del departamento judicial correspondiente.</p>

                    <div class="contrato-firmas">
                        <div class="firma-bloque">
                            <div class="firma-linea"></div>
                            <p><strong>${d["lab-empresa-rep"]}</strong></p>
                            <p>EMPLEADOR — ${d["lab-empresa-nombre"]}</p>
                            <p>RNC: ${d["lab-empresa-rnc"]}</p>
                        </div>
                        <div class="firma-bloque">
                            <div class="firma-linea"></div>
                            <p><strong>${d["lab-empleado-nombre"]}</strong></p>
                            <p>TRABAJADOR — Cédula: ${d["lab-empleado-cedula"]}</p>
                        </div>
                    </div>
                    <p class="contrato-nota-legal">⚠️ Este documento es un borrador de referencia generado automáticamente con fines informativos. Debe ser revisado por un abogado calificado. LexTools RD no asume responsabilidad por su uso.</p>
                </div>`;
        }
    },

    "compraventa-vehiculo": {
        titulo: "Contrato de Compraventa de Vehículo de Motor",
        campos: [
            { id: "veh-vendedor-nombre",   label: "Nombre completo del Vendedor",              tipo: "text",   placeholder: "Ej: Ana María Rodríguez Familia" },
            { id: "veh-vendedor-cedula",   label: "Cédula del Vendedor",                        tipo: "text",   placeholder: "Ej: 001-0000004-4" },
            { id: "veh-comprador-nombre",  label: "Nombre completo del Comprador",              tipo: "text",   placeholder: "Ej: Luis Ramón Castro Nolasco" },
            { id: "veh-comprador-cedula",  label: "Cédula del Comprador",                       tipo: "text",   placeholder: "Ej: 001-0000005-5" },
            { id: "veh-marca",             label: "Marca del Vehículo",                         tipo: "text",   placeholder: "Ej: Toyota" },
            { id: "veh-modelo",            label: "Modelo del Vehículo",                        tipo: "text",   placeholder: "Ej: Corolla" },
            { id: "veh-anio",              label: "Año del Vehículo",                           tipo: "number", placeholder: "Ej: 2020" },
            { id: "veh-color",             label: "Color",                                       tipo: "text",   placeholder: "Ej: Blanco Perla" },
            { id: "veh-placa",             label: "Número de Placa",                            tipo: "text",   placeholder: "Ej: A123456" },
            { id: "veh-chasis",            label: "Número de Chasis (VIN)",                     tipo: "text",   placeholder: "Ej: 1HGBH41JXMN109186" },
            { id: "veh-motor",             label: "Número de Motor",                            tipo: "text",   placeholder: "Ej: 2NZ-B123456" },
            { id: "veh-precio",            label: "Precio de Venta (RD$)",                      tipo: "number", placeholder: "Ej: 850000" },
            { id: "veh-forma-pago",        label: "Forma de Pago",                              tipo: "select", opciones: ["Pago en efectivo al contado", "Transferencia bancaria al contado", "Pago parcial con saldo pendiente", "Financiamiento a través de tercero"] },
            { id: "veh-ciudad",            label: "Ciudad donde se suscribe",                   tipo: "text",   placeholder: "Ej: Santo Domingo" },
            { id: "veh-fecha-firma",       label: "Fecha de Firma",                              tipo: "date",   placeholder: "" },
        ],
        generar: (d) => {
            const hoy = formatearFechaLarga(d["veh-fecha-firma"]);
            const precio = parseFloat(d["veh-precio"]);
            return `
                <div class="contrato-preview-body">
                    <h2 class="contrato-titulo">${PLANTILLAS_CONTRATOS["compraventa-vehiculo"].titulo.toUpperCase()}</h2>
                    <p class="contrato-subtitulo">República Dominicana</p>

                    <p>En la ciudad de <strong>${d["veh-ciudad"]}</strong>, a los ${hoy}, comparecen:</p>

                    <p><strong>VENDEDOR:</strong> ${d["veh-vendedor-nombre"]}, C.I.E. No. <strong>${d["veh-vendedor-cedula"]}</strong>;</p>
                    <p><strong>COMPRADOR:</strong> ${d["veh-comprador-nombre"]}, C.I.E. No. <strong>${d["veh-comprador-cedula"]}</strong>;</p>

                    <p>Convienen celebrar el presente CONTRATO DE COMPRAVENTA DE VEHÍCULO, bajo las siguientes condiciones:</p>

                    <h4>PRIMERO: DEL VEHÍCULO</h4>
                    <p>El VENDEDOR da en venta al COMPRADOR el siguiente vehículo de motor de su plena propiedad:</p>
                    <ul>
                        <li><strong>Marca:</strong> ${d["veh-marca"]}</li>
                        <li><strong>Modelo:</strong> ${d["veh-modelo"]}</li>
                        <li><strong>Año:</strong> ${d["veh-anio"]}</li>
                        <li><strong>Color:</strong> ${d["veh-color"]}</li>
                        <li><strong>Placa:</strong> ${d["veh-placa"]}</li>
                        <li><strong>Chasis (VIN):</strong> ${d["veh-chasis"]}</li>
                        <li><strong>Número de Motor:</strong> ${d["veh-motor"]}</li>
                    </ul>

                    <h4>SEGUNDO: DEL PRECIO Y FORMA DE PAGO</h4>
                    <p>El precio acordado de venta es la suma de <strong>RD$ ${precio.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong> (${numeroALetras(precio)} pesos dominicanos), bajo la modalidad de: <strong>${d["veh-forma-pago"]}</strong>.</p>

                    <h4>TERCERO: DE LA ENTREGA</h4>
                    <p>El VENDEDOR hace entrega del vehículo en este acto, junto con todos los documentos que acreditan su propiedad, incluyendo la Matrícula vigente y cualesquiera otros documentos pertinentes. El vehículo se entrega libre de gravámenes, prendas e hipotecas.</p>

                    <h4>CUARTO: DE LAS GARANTÍAS</h4>
                    <p>El VENDEDOR garantiza que es el legítimo propietario del vehículo descrito, que el mismo no está sujeto a ningún litigio, embargo o restricción legal, y que transfiere la plena propiedad libre de todo tipo de cargas al COMPRADOR.</p>

                    <h4>QUINTO: DE LOS IMPUESTOS Y GASTOS DE TRASPASO</h4>
                    <p>Los gastos del impuesto de traspaso vehicular ante la DGII (2% del valor declarado) y los trámites de nueva matrícula ante el INTRANT/DIGESETT serán sufragados por el <strong>COMPRADOR</strong>, salvo acuerdo en contrario entre las partes.</p>

                    <h4>SEXTO: LEY APLICABLE</h4>
                    <p>El presente contrato se rige por el Código Civil y las leyes de la República Dominicana. Las controversias serán resueltas por los Tribunales competentes de <strong>${d["veh-ciudad"]}</strong>.</p>

                    <div class="contrato-firmas">
                        <div class="firma-bloque">
                            <div class="firma-linea"></div>
                            <p><strong>${d["veh-vendedor-nombre"]}</strong></p>
                            <p>VENDEDOR — Cédula: ${d["veh-vendedor-cedula"]}</p>
                        </div>
                        <div class="firma-bloque">
                            <div class="firma-linea"></div>
                            <p><strong>${d["veh-comprador-nombre"]}</strong></p>
                            <p>COMPRADOR — Cédula: ${d["veh-comprador-cedula"]}</p>
                        </div>
                    </div>
                    <p class="contrato-nota-legal">⚠️ Este documento es un borrador de referencia generado automáticamente. Debe ser revisado y autenticado notarialmente. LexTools RD no asume responsabilidad por su uso.</p>
                </div>`;
        }
    },

    "poder-especial": {
        titulo: "Poder Especial Notarial",
        campos: [
            { id: "pod-poderdante-nombre",  label: "Nombre completo del Poderdante (quien otorga)",  tipo: "text",   placeholder: "Ej: Roberto Mejía Santos" },
            { id: "pod-poderdante-cedula",  label: "Cédula del Poderdante",                           tipo: "text",   placeholder: "Ej: 001-0000006-6" },
            { id: "pod-poderdante-dir",     label: "Domicilio del Poderdante",                        tipo: "text",   placeholder: "Ej: Calle El Conde #32, Zona Colonial, Santo Domingo" },
            { id: "pod-apoderado-nombre",   label: "Nombre completo del Apoderado (quien recibe)",    tipo: "text",   placeholder: "Ej: Carmen Ureña de los Santos" },
            { id: "pod-apoderado-cedula",   label: "Cédula del Apoderado",                            tipo: "text",   placeholder: "Ej: 001-0000007-7" },
            { id: "pod-objeto",             label: "Objeto del Poder (¿Para qué se otorga?)",         tipo: "textarea", placeholder: "Ej: Para gestionar y cobrar en mi nombre la pensión alimentaria dispuesta en la Sentencia No. 001-2024 del Juzgado de Paz..." },
            { id: "pod-limites",            label: "Facultades Especiales / Limitaciones (opcional)", tipo: "textarea", placeholder: "Ej: El apoderado no podrá comprometer bienes inmuebles ni contraer obligaciones en mi nombre..." },
            { id: "pod-duracion",           label: "Vigencia del Poder",                              tipo: "select", opciones: ["Hasta que sea revocado expresamente", "Por un período de 6 meses", "Por un período de 1 año", "Por un período de 2 años", "Para un acto específico (se extingue al cumplirse)"] },
            { id: "pod-ciudad",             label: "Ciudad donde se suscribe",                        tipo: "text",   placeholder: "Ej: Santo Domingo" },
            { id: "pod-fecha-firma",        label: "Fecha de Firma",                                  tipo: "date",   placeholder: "" },
        ],
        generar: (d) => {
            const hoy = formatearFechaLarga(d["pod-fecha-firma"]);
            return `
                <div class="contrato-preview-body">
                    <h2 class="contrato-titulo">${PLANTILLAS_CONTRATOS["poder-especial"].titulo.toUpperCase()}</h2>
                    <p class="contrato-subtitulo">República Dominicana</p>

                    <p>En la ciudad de <strong>${d["pod-ciudad"]}</strong>, República Dominicana, a los ${hoy}, ante Notario Público (a ser completado por el fedatario), comparece:</p>

                    <p>El señor(a) <strong>${d["pod-poderdante-nombre"]}</strong>, dominicano(a), mayor de edad, portador(a) de la Cédula de Identidad y Electoral No. <strong>${d["pod-poderdante-cedula"]}</strong>, con domicilio en <strong>${d["pod-poderdante-dir"]}</strong>, a quien en lo sucesivo se denominará el <strong>PODERDANTE</strong>;</p>

                    <p>El PODERDANTE, libre y espontáneamente, por el presente acto otorga <strong>PODER ESPECIAL</strong> a favor de:</p>

                    <p>El señor(a) <strong>${d["pod-apoderado-nombre"]}</strong>, dominicano(a), mayor de edad, portador(a) de la C.I.E. No. <strong>${d["pod-apoderado-cedula"]}</strong>, en lo sucesivo denominado(a) el <strong>APODERADO</strong>;</p>

                    <h4>PRIMERO: OBJETO DEL PODER</h4>
                    <p>El presente poder especial se otorga para que el APODERADO actúe en nombre y representación del PODERDANTE a los fines de: <em>${d["pod-objeto"]}</em></p>

                    <h4>SEGUNDO: FACULTADES</h4>
                    <p>En virtud del presente poder, el APODERADO queda autorizado a firmar, gestionar, presentar y retirar cualesquiera documentos, solicitudes, cobros o diligencias necesarias para el cumplimiento del objeto descrito, pudiendo comparecer ante cualquier institución pública o privada, y realizar todos los actos que sean necesarios y accesorios para el objeto del mandato.</p>

                    ${d["pod-limites"] ? `<h4>TERCERO: LIMITACIONES</h4><p>${d["pod-limites"]}</p>` : ""}

                    <h4>${d["pod-limites"] ? "CUARTO" : "TERCERO"}: VIGENCIA</h4>
                    <p>El presente poder tendrá vigencia: <strong>${d["pod-duracion"]}</strong>. El PODERDANTE se reserva el derecho de revocarlo en cualquier momento mediante acto notarial.</p>

                    <h4>${d["pod-limites"] ? "QUINTO" : "CUARTO"}: RATIFICACIÓN</h4>
                    <p>El PODERDANTE declara que ratificará todo lo que el APODERADO realice en virtud del presente mandato, dentro de los límites del objeto aquí establecido.</p>

                    <div class="contrato-firmas" style="margin-top: 60px;">
                        <div class="firma-bloque">
                            <div class="firma-linea"></div>
                            <p><strong>${d["pod-poderdante-nombre"]}</strong></p>
                            <p>PODERDANTE — Cédula: ${d["pod-poderdante-cedula"]}</p>
                        </div>
                        <div class="firma-bloque">
                            <div class="firma-linea"></div>
                            <p><strong>NOTARIO PÚBLICO</strong></p>
                            <p>Sello y Firma del Fedatario</p>
                        </div>
                    </div>
                    <p class="contrato-nota-legal">⚠️ Este documento es un borrador de referencia. Para que tenga plena validez legal, debe ser leído, aprobado y autenticado por un Notario Público habilitado por el Colegio Dominicano de Notarios. LexTools RD no asume responsabilidad por su uso.</p>
                </div>`;
        }
    },

    "prestamo-personal": {
        titulo: "Contrato de Préstamo Personal",
        campos: [
            { id: "pres-prestamista-nombre",  label: "Nombre completo del Prestamista (quien presta)",  tipo: "text",   placeholder: "Ej: Firma Financiera S.A.S." },
            { id: "pres-prestamista-cedula",  label: "RNC / Cédula del Prestamista",                    tipo: "text",   placeholder: "Ej: 1-01-00001-1" },
            { id: "pres-prestatario-nombre",  label: "Nombre completo del Prestatario (quien recibe)",   tipo: "text",   placeholder: "Ej: Juana Francisca Matos Reyes" },
            { id: "pres-prestatario-cedula",  label: "Cédula del Prestatario",                           tipo: "text",   placeholder: "Ej: 001-0000008-8" },
            { id: "pres-monto",               label: "Monto del Préstamo (RD$)",                         tipo: "number", placeholder: "Ej: 200000" },
            { id: "pres-tasa",                label: "Tasa de Interés Mensual (%)",                      tipo: "number", placeholder: "Ej: 2.5" },
            { id: "pres-plazo",               label: "Plazo de Pago",                                    tipo: "select", opciones: ["3 meses", "6 meses", "12 meses", "18 meses", "24 meses", "36 meses"] },
            { id: "pres-forma-pago",          label: "Forma de Pago de las Cuotas",                      tipo: "select", opciones: ["Cuotas mensuales iguales (sistema francés)", "Abonos a capital más intereses sobre saldo", "Pago único al vencimiento"] },
            { id: "pres-garantia",            label: "Garantía Ofrecida (opcional)",                     tipo: "text",   placeholder: "Ej: Garantía personal solidaria / Inmueble en Hipoteca / Sin garantía real" },
            { id: "pres-ciudad",              label: "Ciudad donde se suscribe",                         tipo: "text",   placeholder: "Ej: Santiago de los Caballeros" },
            { id: "pres-fecha-firma",         label: "Fecha de Firma",                                   tipo: "date",   placeholder: "" },
        ],
        generar: (d) => {
            const hoy = formatearFechaLarga(d["pres-fecha-firma"]);
            const monto = parseFloat(d["pres-monto"]);
            const tasa = parseFloat(d["pres-tasa"]);
            return `
                <div class="contrato-preview-body">
                    <h2 class="contrato-titulo">${PLANTILLAS_CONTRATOS["prestamo-personal"].titulo.toUpperCase()}</h2>
                    <p class="contrato-subtitulo">República Dominicana — Código Civil, Arts. 1892 y siguientes</p>

                    <p>En la ciudad de <strong>${d["pres-ciudad"]}</strong>, a los ${hoy}, comparecen:</p>

                    <p><strong>PRESTAMISTA:</strong> <strong>${d["pres-prestamista-nombre"]}</strong>, RNC/Cédula No. <strong>${d["pres-prestamista-cedula"]}</strong>;</p>
                    <p><strong>PRESTATARIO:</strong> <strong>${d["pres-prestatario-nombre"]}</strong>, C.I.E. No. <strong>${d["pres-prestatario-cedula"]}</strong>;</p>

                    <p>Convienen celebrar el siguiente CONTRATO DE PRÉSTAMO PERSONAL:</p>

                    <h4>PRIMERO: DEL MONTO PRESTADO</h4>
                    <p>El PRESTAMISTA entrega en préstamo al PRESTATARIO la suma de <strong>RD$ ${monto.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong> (${numeroALetras(monto)} pesos dominicanos), cuya recepción el PRESTATARIO declara en este acto.</p>

                    <h4>SEGUNDO: DE LOS INTERESES</h4>
                    <p>El préstamo devengará una tasa de interés del <strong>${tasa}% mensual</strong> (${(tasa * 12).toFixed(2)}% anual) sobre el saldo de capital adeudado, calculado de forma ${d["pres-forma-pago"].toLowerCase()}.</p>

                    <h4>TERCERO: DEL PLAZO Y FORMA DE PAGO</h4>
                    <p>El PRESTATARIO se compromete a devolver el capital prestado más los intereses generados en un plazo de <strong>${d["pres-plazo"]}</strong>, bajo la modalidad de: <strong>${d["pres-forma-pago"]}</strong>. Las cuotas serán pagaderas el mismo día de cada mes.</p>

                    <h4>CUARTO: DE LA GARANTÍA</h4>
                    <p>El presente préstamo queda garantizado mediante: <strong>${d["pres-garantia"] || "garantía personal del PRESTATARIO"}</strong>.</p>

                    <h4>QUINTO: DEL INCUMPLIMIENTO Y MORA</h4>
                    <p>En caso de mora en el pago de cualquier cuota, el PRESTATARIO pagará adicionalmente un interés moratorio del <strong>1.5% mensual adicional</strong> sobre el saldo vencido. Si el incumplimiento persiste por más de 30 días, el PRESTAMISTA podrá declarar el préstamo de plazo vencido y exigir el pago total del saldo pendiente.</p>

                    <h4>SEXTO: DE LA COMPENSACIÓN</h4>
                    <p>El PRESTATARIO podrá realizar prepagos parciales o totales en cualquier momento, los cuales serán aplicados primero a intereses vencidos, luego a capital, sin penalidad adicional.</p>

                    <h4>SÉPTIMO: LEY APLICABLE</h4>
                    <p>El presente contrato se rige por los Arts. 1892 y siguientes del Código Civil de la República Dominicana y demás normas aplicables. Las controversias serán resueltas por los Tribunales competentes de <strong>${d["pres-ciudad"]}</strong>.</p>

                    <div class="contrato-firmas">
                        <div class="firma-bloque">
                            <div class="firma-linea"></div>
                            <p><strong>${d["pres-prestamista-nombre"]}</strong></p>
                            <p>PRESTAMISTA — RNC/Cédula: ${d["pres-prestamista-cedula"]}</p>
                        </div>
                        <div class="firma-bloque">
                            <div class="firma-linea"></div>
                            <p><strong>${d["pres-prestatario-nombre"]}</strong></p>
                            <p>PRESTATARIO — Cédula: ${d["pres-prestatario-cedula"]}</p>
                        </div>
                    </div>
                    <p class="contrato-nota-legal">⚠️ Este documento es un borrador de referencia. Debe ser revisado por un abogado antes de su firma. LexTools RD no asume responsabilidad por su uso.</p>
                </div>`;
        }
    }
};


// ──────────────────────────────────────────────────────────────────────────────
// FUNCIONES AUXILIARES
// ──────────────────────────────────────────────────────────────────────────────

function formatearFechaLarga(isoStr) {
    if (!isoStr) return "[FECHA]";
    const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const [y, m, d] = isoStr.split("-").map(Number);
    return `${d} días del mes de ${meses[m - 1]} del año ${y}`;
}

function numeroALetras(n) {
    // Convierte números hasta 999,999,999 a texto en español
    if (isNaN(n)) return "[MONTO]";
    const unidades = ["","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","once","doce","trece","catorce","quince","dieciséis","diecisiete","dieciocho","diecinueve","veinte"];
    const decenas = ["","","veinti","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"];
    const centenas = ["","ciento","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];

    function _cent(n) {
        if (n === 100) return "cien";
        if (n < 21) return unidades[n];
        if (n < 30) return (n === 20 ? "veinte" : `veinti${unidades[n - 20]}`);
        const d = Math.floor(n / 10), u = n % 10;
        return u === 0 ? decenas[d] : `${decenas[d]} y ${unidades[u]}`;
    }
    function _miles(n) {
        if (n < 1000) return _cent(n);
        const miles = Math.floor(n / 1000), resto = n % 1000;
        const prefijo = miles === 1 ? "mil" : `${_cent(miles)} mil`;
        return resto === 0 ? prefijo : `${prefijo} ${_cent(resto)}`;
    }

    const entero = Math.floor(n);
    if (entero === 0) return "cero";
    if (entero < 1000000) return _miles(entero);
    const millones = Math.floor(entero / 1000000), resto = entero % 1000000;
    const prefM = millones === 1 ? "un millón" : `${_miles(millones)} millones`;
    return resto === 0 ? prefM : `${prefM} ${_miles(resto)}`;
}


// ──────────────────────────────────────────────────────────────────────────────
// LÓGICA DE UI
// ──────────────────────────────────────────────────────────────────────────────

let tipoContratoActual = "arrendamiento";

document.addEventListener("DOMContentLoaded", () => {
    const selectTipo = document.getElementById("con-tipo-contrato");
    const btnGenerar = document.getElementById("btn-generar-contrato");
    const btnImprimir = document.getElementById("btn-imprimir-contrato");
    const btnCopiar = document.getElementById("btn-copiar-contrato");

    if (selectTipo) {
        selectTipo.addEventListener("change", () => {
            tipoContratoActual = selectTipo.value;
            renderizarCampos(tipoContratoActual);
            ocultarPreview();
        });
        // Cargar campos iniciales
        renderizarCampos(tipoContratoActual);
    }

    if (btnGenerar) {
        btnGenerar.addEventListener("click", generarContrato);
    }

    if (btnImprimir) {
        btnImprimir.addEventListener("click", imprimirContrato);
    }

    if (btnCopiar) {
        btnCopiar.addEventListener("click", copiarContrato);
    }
});

function renderizarCampos(tipo) {
    const plantilla = PLANTILLAS_CONTRATOS[tipo];
    if (!plantilla) return;

    const contenedor = document.getElementById("con-campos-dinamicos");
    if (!contenedor) return;

    let html = "";
    plantilla.campos.forEach(campo => {
        if (campo.tipo === "select") {
            html += `
                <div class="form-group">
                    <label for="${campo.id}">${campo.label}:</label>
                    <select id="${campo.id}">
                        ${campo.opciones.map(op => `<option value="${op}">${op}</option>`).join("")}
                    </select>
                </div>`;
        } else if (campo.tipo === "textarea") {
            html += `
                <div class="form-group form-full-width">
                    <label for="${campo.id}">${campo.label}:</label>
                    <textarea id="${campo.id}" rows="3" style="resize:vertical; font-family:inherit; font-size:0.9rem; padding:12px; border:2px solid var(--border); border-radius:10px; background:var(--bg-main); color:var(--text-main); width:100%; box-sizing:border-box;" placeholder="${campo.placeholder}"></textarea>
                </div>`;
        } else {
            html += `
                <div class="form-group">
                    <label for="${campo.id}">${campo.label}:</label>
                    <input type="${campo.tipo}" id="${campo.id}" placeholder="${campo.placeholder}" ${campo.tipo === "number" ? 'step="0.01" min="0"' : ""}>
                </div>`;
        }
    });

    contenedor.innerHTML = html;
}

function generarContrato() {
    const plantilla = PLANTILLAS_CONTRATOS[tipoContratoActual];
    if (!plantilla) return;

    // Recoger datos del formulario
    const datos = {};
    let valido = true;

    plantilla.campos.forEach(campo => {
        const el = document.getElementById(campo.id);
        if (el) {
            datos[campo.id] = el.value.trim();
            if (!datos[campo.id] && campo.tipo !== "textarea") {
                el.style.borderColor = "var(--secondary)";
                valido = false;
            } else {
                el.style.borderColor = "";
            }
        }
    });

    if (!valido) {
        alert("Por favor, complete todos los campos requeridos antes de generar el contrato.");
        return;
    }

    // Generar HTML del contrato
    const contratoHTML = plantilla.generar(datos);

    // Mostrar preview
    const previewArea = document.getElementById("con-preview-area");
    const previewContainer = document.getElementById("con-preview-container");

    if (previewArea && previewContainer) {
        previewArea.innerHTML = contratoHTML;
        previewContainer.style.display = "block";
        previewContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function ocultarPreview() {
    const previewContainer = document.getElementById("con-preview-container");
    if (previewContainer) previewContainer.style.display = "none";
}

function imprimirContrato() {
    const contenido = document.getElementById("con-preview-area");
    if (!contenido) return;

    const ventana = window.open("", "_blank", "width=900,height=700");
    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Contrato Legal — LexTools RD</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
                body { font-family: 'EB Garamond', Georgia, serif; font-size: 12pt; color: #1a1a2e; margin: 2.5cm; line-height: 1.7; }
                h2.contrato-titulo { text-align: center; font-size: 14pt; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px; }
                p.contrato-subtitulo { text-align: center; font-style: italic; margin-bottom: 24px; color: #555; font-size: 10pt; }
                h4 { margin-top: 20px; margin-bottom: 6px; font-size: 11pt; text-decoration: underline; }
                p, li { text-align: justify; margin-bottom: 10px; }
                ul { margin-left: 20px; }
                .contrato-firmas { display: flex; justify-content: space-around; margin-top: 60px; }
                .firma-bloque { text-align: center; width: 40%; }
                .firma-linea { border-bottom: 1px solid #333; margin-bottom: 8px; height: 50px; }
                .contrato-nota-legal { margin-top: 30px; font-size: 9pt; color: #777; border-top: 1px solid #ccc; padding-top: 10px; font-style: italic; }
                @media print { body { margin: 2cm; } }
            </style>
        </head>
        <body>${contenido.innerHTML}</body>
        </html>`);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => ventana.print(), 500);
}

function copiarContrato() {
    const contenido = document.getElementById("con-preview-area");
    if (!contenido) return;

    // Extraer texto plano del HTML
    const textoPlano = contenido.innerText;

    navigator.clipboard.writeText(textoPlano).then(() => {
        const btn = document.getElementById("btn-copiar-contrato");
        const original = btn.innerHTML;
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ¡Copiado al Portapapeles!`;
        btn.style.backgroundColor = "var(--success)";
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.backgroundColor = "";
        }, 2500);
    }).catch(() => {
        alert("No se pudo copiar automáticamente. Por favor, seleccione el texto del contrato manualmente.");
    });
}
