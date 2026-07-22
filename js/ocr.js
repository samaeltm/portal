/* ==========================================================================
   LÓGICA: EXTRACTOR DE TEXTO Y OCR DE PDF (CLIENTE SEGURO)
   Modo 1: Extracción de texto digital nativo vía PDF.js
   Modo 2: OCR sobre páginas renderizadas vía Tesseract.js (español)
   100% local — sin subida de archivos al servidor.
   ========================================================================== */

let pdfFileForOcr = null;

// ──────────────────────────────────────────────────────────────────────────────
// INICIALIZACIÓN DE EVENTOS
// ──────────────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    const ocrInput    = document.getElementById("ocr-file-input");
    const ocrDropzone = document.getElementById("ocr-dropzone");
    const ocrInfoBox  = document.getElementById("ocr-file-info");
    const btnRemove   = document.getElementById("btn-remove-ocr-file");
    const btnExtract  = document.getElementById("btn-extract-text");
    const btnCopiar   = document.getElementById("btn-ocr-copiar");
    const btnDescargar= document.getElementById("btn-ocr-descargar");

    // Dropzone
    if (ocrDropzone && ocrInput) {
        ocrDropzone.addEventListener("click", () => ocrInput.click());
        ocrDropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            ocrDropzone.classList.add("dragover");
        });
        ocrDropzone.addEventListener("dragleave", () => ocrDropzone.classList.remove("dragover"));
        ocrDropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            ocrDropzone.classList.remove("dragover");
            if (e.dataTransfer.files.length > 0) {
                handleOcrFile(e.dataTransfer.files[0]);
            }
        });
        ocrInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                handleOcrFile(e.target.files[0]);
            }
        });
    }

    // Remover archivo
    if (btnRemove) {
        btnRemove.addEventListener("click", (e) => {
            e.stopPropagation();
            removerArchivoOcr();
        });
    }

    // Botón principal de extracción
    if (btnExtract) {
        btnExtract.addEventListener("click", ejecutarExtraccion);
    }

    // Botón copiar resultado
    if (btnCopiar) {
        btnCopiar.addEventListener("click", copiarTextoOcr);
    }

    // Botón descargar .txt
    if (btnDescargar) {
        btnDescargar.addEventListener("click", descargarTextoOcr);
    }
});


// ──────────────────────────────────────────────────────────────────────────────
// MANEJO DE ARCHIVOS
// ──────────────────────────────────────────────────────────────────────────────

function handleOcrFile(file) {
    if (file.type !== "application/pdf") {
        alert("Por favor, cargue únicamente archivos PDF.");
        return;
    }
    pdfFileForOcr = file;
    document.getElementById("ocr-file-name").innerText = `${file.name} (${formatBytesOcr(file.size)})`;
    document.getElementById("ocr-file-info").classList.add("active");
    document.getElementById("btn-extract-text").removeAttribute("disabled");
    ocultarResultadosOcr();
}

function removerArchivoOcr() {
    pdfFileForOcr = null;
    document.getElementById("ocr-file-input").value = "";
    document.getElementById("ocr-file-info").classList.remove("active");
    document.getElementById("btn-extract-text").setAttribute("disabled", "true");
    ocultarResultadosOcr();
}

function ocultarResultadosOcr() {
    const res = document.getElementById("ocr-results-box");
    if (res) res.style.display = "none";
}


// ──────────────────────────────────────────────────────────────────────────────
// EXTRACCIÓN PRINCIPAL
// ──────────────────────────────────────────────────────────────────────────────

async function ejecutarExtraccion() {
    if (!pdfFileForOcr) return;

    const modo = document.getElementById("ocr-modo").value; // "digital" | "ocr"
    const paginasInput = document.getElementById("ocr-paginas").value.trim();

    const btnExtract = document.getElementById("btn-extract-text");
    const originalHTML = btnExtract.innerHTML;
    btnExtract.setAttribute("disabled", "true");

    // Barra de progreso
    const progressBox = document.getElementById("ocr-progress-box");
    const progressBar = document.getElementById("ocr-progress-bar");
    const progressLabel = document.getElementById("ocr-progress-label");

    if (progressBox) progressBox.style.display = "block";

    function actualizarProgreso(porcentaje, texto) {
        if (progressBar) progressBar.style.width = `${porcentaje}%`;
        if (progressLabel) progressLabel.innerText = texto;
    }

    try {
        if (typeof pdfjsLib === "undefined") {
            alert("La librería PDF.js no está disponible. Verifique su conexión a internet.");
            return;
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

        btnExtract.innerHTML = `<span class="loading-spinner"></span> Cargando PDF...`;
        actualizarProgreso(5, "Cargando documento PDF...");

        const arrayBuffer = await pdfFileForOcr.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        // Determinar páginas a procesar
        const paginas = parsearRangoPaginas(paginasInput, totalPages);

        if (paginas.length === 0) {
            alert(`El rango de páginas especificado no es válido para un documento de ${totalPages} páginas.`);
            return;
        }

        actualizarProgreso(10, `Documento cargado: ${totalPages} páginas. Procesando...`);

        let textoFinal = "";

        if (modo === "digital") {
            // ── MODO DIGITAL: Extracción de texto nativo vía PDF.js ──
            btnExtract.innerHTML = `<span class="loading-spinner"></span> Extrayendo texto nativo...`;
            textoFinal = await extraerTextoDigital(pdf, paginas, actualizarProgreso);

        } else {
            // ── MODO OCR: Renderizar página y aplicar Tesseract.js ──
            if (typeof Tesseract === "undefined") {
                alert("La librería Tesseract.js (OCR) no está disponible. Verifique su conexión a internet.");
                return;
            }
            btnExtract.innerHTML = `<span class="loading-spinner"></span> Aplicando OCR... (puede tardar)`;
            textoFinal = await extraerTextoOcr(pdf, paginas, actualizarProgreso);
        }

        // Mostrar resultados
        actualizarProgreso(100, "¡Extracción completada!");
        mostrarResultadosOcr(textoFinal, paginas.length, totalPages, modo);

    } catch (err) {
        console.error("Error en extracción OCR:", err);
        alert("Ocurrió un error durante la extracción. Verifique que el PDF no esté protegido con contraseña.");
    } finally {
        btnExtract.removeAttribute("disabled");
        btnExtract.innerHTML = originalHTML;
        setTimeout(() => {
            if (progressBox) progressBox.style.display = "none";
        }, 2000);
    }
}


// ──────────────────────────────────────────────────────────────────────────────
// MODO 1: EXTRACCIÓN DE TEXTO DIGITAL (PDF.js nativo)
// ──────────────────────────────────────────────────────────────────────────────

async function extraerTextoDigital(pdf, paginas, onProgress) {
    let texto = "";
    const total = paginas.length;

    for (let i = 0; i < total; i++) {
        const numPag = paginas[i];
        const page = await pdf.getPage(numPag);
        const textContent = await page.getTextContent();

        // Unir items de texto respetando espacios y saltos de línea
        let paginaTexto = "";
        let lastY = null;

        textContent.items.forEach(item => {
            const y = item.transform ? item.transform[5] : 0;
            if (lastY !== null && Math.abs(y - lastY) > 5) {
                paginaTexto += "\n";
            }
            paginaTexto += item.str;
            lastY = y;
        });

        texto += `\n\n─────── PÁGINA ${numPag} ───────\n\n${paginaTexto.trim()}`;
        onProgress(10 + Math.floor((i + 1) / total * 85), `Extrayendo texto de página ${numPag} de ${pdf.numPages}...`);
    }

    return texto.trim();
}


// ──────────────────────────────────────────────────────────────────────────────
// MODO 2: OCR CON TESSERACT.JS
// ──────────────────────────────────────────────────────────────────────────────

async function extraerTextoOcr(pdf, paginas, onProgress) {
    let texto = "";
    const total = paginas.length;
    const escalaOcr = 2.0; // Mayor escala = mayor precisión OCR

    // Crear un único worker de Tesseract para reutilizarlo
    const worker = await Tesseract.createWorker("spa", 1, {
        logger: () => {} // Silenciar logs internos de Tesseract
    });

    try {
        for (let i = 0; i < total; i++) {
            const numPag = paginas[i];
            onProgress(10 + Math.floor((i / total) * 80), `OCR: procesando página ${numPag} de ${pdf.numPages}...`);

            const page = await pdf.getPage(numPag);
            const viewport = page.getViewport({ scale: escalaOcr });

            // Renderizar página en canvas off-screen
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d");

            await page.render({ canvasContext: ctx, viewport }).promise;

            // Obtener imagen del canvas como Blob para Tesseract
            const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));

            const { data: { text } } = await worker.recognize(blob);
            texto += `\n\n─────── PÁGINA ${numPag} ───────\n\n${text.trim()}`;
        }
    } finally {
        await worker.terminate();
    }

    return texto.trim();
}


// ──────────────────────────────────────────────────────────────────────────────
// MOSTRAR RESULTADOS
// ──────────────────────────────────────────────────────────────────────────────

function mostrarResultadosOcr(texto, paginasProcesadas, totalPaginas, modo) {
    const resultBox = document.getElementById("ocr-results-box");
    const textarea  = document.getElementById("ocr-texto-resultado");
    const statsEl   = document.getElementById("ocr-stats");

    if (!resultBox || !textarea) return;

    const caracteres = texto.length;
    const palabras   = texto.split(/\s+/).filter(w => w.length > 0).length;
    const lineas     = texto.split("\n").length;

    textarea.value = texto || "(No se detectó texto en las páginas seleccionadas. Si el PDF es escaneado, intente el Modo OCR.)";

    if (statsEl) {
        const modoTexto = modo === "digital" ? "Extracción de texto nativo (PDF digital)" : "OCR con reconocimiento de caracteres (Tesseract.js)";
        statsEl.innerHTML = `
            <span>📄 Páginas procesadas: <strong>${paginasProcesadas} / ${totalPaginas}</strong></span>
            <span>📝 Palabras: <strong>${palabras.toLocaleString()}</strong></span>
            <span>🔤 Caracteres: <strong>${caracteres.toLocaleString()}</strong></span>
            <span>↩️ Líneas: <strong>${lineas.toLocaleString()}</strong></span>
            <span>⚙️ Modo: <strong>${modoTexto}</strong></span>
        `;
    }

    resultBox.style.display = "block";
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
}


// ──────────────────────────────────────────────────────────────────────────────
// ACCIONES SOBRE TEXTO EXTRAÍDO
// ──────────────────────────────────────────────────────────────────────────────

function copiarTextoOcr() {
    const textarea = document.getElementById("ocr-texto-resultado");
    if (!textarea || !textarea.value) return;

    navigator.clipboard.writeText(textarea.value).then(() => {
        const btn = document.getElementById("btn-ocr-copiar");
        const original = btn.innerHTML;
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ¡Copiado!`;
        btn.style.backgroundColor = "var(--success)";
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.backgroundColor = "";
        }, 2500);
    }).catch(() => {
        textarea.select();
        document.execCommand("copy");
    });
}

function descargarTextoOcr() {
    const textarea = document.getElementById("ocr-texto-resultado");
    if (!textarea || !textarea.value) return;

    const blob = new Blob([textarea.value], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const nombre = pdfFileForOcr ? pdfFileForOcr.name.replace(/\.pdf$/i, "") + "_texto_extraido.txt" : "texto_extraido.txt";
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


// ──────────────────────────────────────────────────────────────────────────────
// UTILIDADES
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Parsea un string de rangos de páginas tipo "1-3, 5, 8-12" y devuelve un array de números.
 * Si el string está vacío, devuelve todas las páginas.
 */
function parsearRangoPaginas(input, totalPages) {
    if (!input || input.trim() === "") {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const paginas = new Set();
    const partes = input.split(",").map(s => s.trim());

    for (const parte of partes) {
        if (parte.includes("-")) {
            const [a, b] = parte.split("-").map(Number);
            if (!isNaN(a) && !isNaN(b)) {
                for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
                    if (i >= 1 && i <= totalPages) paginas.add(i);
                }
            }
        } else {
            const n = Number(parte);
            if (!isNaN(n) && n >= 1 && n <= totalPages) paginas.add(n);
        }
    }

    return [...paginas].sort((a, b) => a - b);
}

/**
 * Formatea bytes para el OCR (función local para no depender de otros scripts).
 */
function formatBytesOcr(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}
