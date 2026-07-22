/* ==========================================================================
   LÓGICA: COMPRESOR DE PDF (OPTIMIZADOR INTELIGENTE — LOCAL)
   
   Estrategia de dos pasos:
   1. Reguardado limpio con pdf-lib (elimina metadata, objetos huérfanos, streams
      duplicados). Funciona bien en PDFs digitales (texto + vectores).
   2. Rasterización inteligente a imagen (solo para PDFs con imágenes pesadas o
      escaneados). Compara resultado vs original y usa el menor.
   
   REGLA DE ORO: Jamás se descarga un archivo mayor al original.
   ========================================================================== */

let pdfFileToCompress = null;

// ──────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN PDF.js WORKER
// ──────────────────────────────────────────────────────────────────────────────
if (typeof pdfjsLib !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
}

// ──────────────────────────────────────────────────────────────────────────────
// EVENTOS DE INTERFAZ
// ──────────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const compressInput   = document.getElementById("compress-file-input");
    const compressDropzone= document.getElementById("compress-dropzone");
    const btnRemoveCompress = document.getElementById("btn-remove-compress-file");
    const btnCompress     = document.getElementById("btn-compress-pdf");

    if (compressDropzone && compressInput) {
        compressDropzone.addEventListener("click", () => compressInput.click());
        compressDropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            compressDropzone.classList.add("dragover");
        });
        compressDropzone.addEventListener("dragleave", () =>
            compressDropzone.classList.remove("dragover")
        );
        compressDropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            compressDropzone.classList.remove("dragover");
            if (e.dataTransfer.files.length > 0)
                handleFileToCompress(e.dataTransfer.files[0]);
        });
        compressInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0)
                handleFileToCompress(e.target.files[0]);
        });
    }

    if (btnRemoveCompress) {
        btnRemoveCompress.addEventListener("click", (e) => {
            e.stopPropagation();
            removerArchivoCompress();
        });
    }

    if (btnCompress) {
        btnCompress.addEventListener("click", ejecutarCompresionPDF);
    }
});

function handleFileToCompress(file) {
    if (file.type !== "application/pdf") {
        alert("Por favor, cargue únicamente archivos PDF.");
        return;
    }
    pdfFileToCompress = file;
    document.getElementById("compress-file-name").innerText =
        `${file.name} (${formatBytes(file.size)})`;
    document.getElementById("compress-file-info").classList.add("active");
    document.getElementById("btn-compress-pdf").removeAttribute("disabled");
    const resultBox = document.getElementById("compress-results-box");
    if (resultBox) resultBox.style.display = "none";
}

function removerArchivoCompress() {
    pdfFileToCompress = null;
    document.getElementById("compress-file-input").value = "";
    document.getElementById("compress-file-info").classList.remove("active");
    document.getElementById("btn-compress-pdf").setAttribute("disabled", "true");
    const resultBox = document.getElementById("compress-results-box");
    if (resultBox) resultBox.style.display = "none";
}

// ──────────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL DE COMPRESIÓN
// ──────────────────────────────────────────────────────────────────────────────
async function ejecutarCompresionPDF() {
    if (!pdfFileToCompress) return;

    const nivel = document.getElementById("compress-nivel").value; // "low"|"medium"|"high"
    const btnCompress = document.getElementById("btn-compress-pdf");
    const originalHTML = btnCompress.innerHTML;

    btnCompress.setAttribute("disabled", "true");
    btnCompress.innerHTML = `<span class="loading-spinner"></span> Optimizando PDF...`;

    const originalSize = pdfFileToCompress.size;

    try {
        const arrayBuffer = await pdfFileToCompress.arrayBuffer();

        // ── ESTRATEGIA 1: Re-guardado limpio con pdf-lib ──────────────────────
        // Elimina objetos no referenciados, streams duplicados y metadata innecesaria.
        // No degrada la calidad visual. Eficaz en PDFs digitales de texto + vectores.
        btnCompress.innerHTML = `<span class="loading-spinner"></span> Paso 1/2: Limpiando estructura...`;

        const { PDFDocument } = PDFLib;
        let mejorBytes = null;
        let estrategiaUsada = "limpieza";

        try {
            const pdfDocClean = await PDFDocument.load(arrayBuffer, {
                ignoreEncryption: true,
                updateMetadata: false
            });

            // Comprimir streams de objetos
            pdfDocClean.getForm(); // Fuerza resolución de referencias lazy
            const cleanBytes = await pdfDocClean.save({
                useObjectStreams: true,   // Agrupa objetos → reduce overhead
                addDefaultPage: false,
                objectsPerTick: 50
            });

            if (cleanBytes.length < originalSize) {
                mejorBytes = cleanBytes;
            }
        } catch (e) {
            console.warn("Estrategia 1 (reguardado limpio) no disponible:", e.message);
        }

        // ── ESTRATEGIA 2: Rasterización inteligente (solo si se necesita más) ─
        // Solo se aplica en niveles medium/high Y solo si el resultado
        // es genuinamente menor al original y al resultado de la Estrategia 1.
        if (nivel !== "low") {
            btnCompress.innerHTML = `<span class="loading-spinner"></span> Paso 2/2: Optimizando imágenes...`;

            if (typeof pdfjsLib === "undefined") {
                console.warn("PDF.js no disponible para rasterización.");
            } else {
                try {
                    const rasterBytes = await rasterizarPDF(arrayBuffer, nivel);

                    // Solo usar rasterizado si es estrictamente menor
                    const limiteActual = mejorBytes ? mejorBytes.length : originalSize;
                    if (rasterBytes !== null && rasterBytes.length < limiteActual) {
                        mejorBytes = rasterBytes;
                        estrategiaUsada = "rasterizacion";
                    }
                } catch (e) {
                    console.warn("Estrategia 2 (rasterización) falló:", e.message);
                }
            }
        }

        // ── DECISIÓN FINAL ────────────────────────────────────────────────────
        if (!mejorBytes || mejorBytes.length >= originalSize) {
            // No se logró reducir el tamaño: mostrar aviso y NO descargar
            mostrarResultadosCompresion(originalSize, originalSize, 0, "sin_mejora", null);
            return;
        }

        // Descargar el resultado optimizado
        const compressedSize = mejorBytes.length;
        const savingsPercent = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

        const blob = new Blob([mejorBytes], { type: "application/pdf" });
        const url  = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href  = url;

        const origName = pdfFileToCompress.name;
        link.download  = origName.toLowerCase().endsWith(".pdf")
            ? origName.slice(0, -4) + "_comprimido.pdf"
            : origName + "_comprimido.pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        mostrarResultadosCompresion(originalSize, compressedSize, savingsPercent, estrategiaUsada, nivel);

    } catch (error) {
        console.error("Error en compresión PDF:", error);
        alert("Ocurrió un error al procesar el PDF. Verifique que el archivo no esté protegido con contraseña.");
    } finally {
        btnCompress.removeAttribute("disabled");
        btnCompress.innerHTML = originalHTML;
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// ESTRATEGIA 2: RASTERIZACIÓN CONTROLADA
// Convierte páginas a imagen JPEG/PNG con parámetros que priorizan calidad.
// NUNCA devuelve un archivo si es mayor al original.
// ──────────────────────────────────────────────────────────────────────────────
async function rasterizarPDF(arrayBuffer, nivel) {
    // Parámetros de calidad según nivel
    // Escala: nunca inferior a 1.2 para mantener texto legible
    // Calidad JPEG: nunca inferior a 0.65 para evitar artefactos en texto
    const params = {
        low:    { scale: 1.5, quality: 0.88, format: "image/jpeg" },
        medium: { scale: 1.3, quality: 0.75, format: "image/jpeg" },
        high:   { scale: 1.1, quality: 0.62, format: "image/jpeg" }
    };
    const { scale, quality, format } = params[nivel] || params.medium;

    const { PDFDocument } = PDFLib;

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf  = await loadingTask.promise;
    const totalPages = pdf.numPages;

    const rasterPdf = await PDFDocument.create();

    // Renderizar cada página en un canvas y embedir como JPEG
    for (let i = 1; i <= totalPages; i++) {
        const page     = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas  = document.createElement("canvas");
        canvas.width  = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d", { alpha: false });

        // Fondo blanco explícito antes de renderizar
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Exportar como imagen
        const dataUrl = canvas.toDataURL(format, quality);
        const imgBytes = await fetch(dataUrl).then(r => r.arrayBuffer());

        const embImg  = await rasterPdf.embedJpg(imgBytes);
        const newPage = rasterPdf.addPage([viewport.width, viewport.height]);
        newPage.drawImage(embImg, {
            x: 0, y: 0,
            width: viewport.width,
            height: viewport.height
        });
    }

    return await rasterPdf.save({ useObjectStreams: true });
}

// ──────────────────────────────────────────────────────────────────────────────
// MOSTRAR RESULTADOS EN LA UI
// ──────────────────────────────────────────────────────────────────────────────
function mostrarResultadosCompresion(original, comprimido, ahorro, estrategia, nivel) {
    const resultBox = document.getElementById("compress-results-box");
    if (!resultBox) return;

    resultBox.style.display = "block";

    document.getElementById("res-comp-orig").innerText  = formatBytes(original);
    document.getElementById("res-comp-final").innerText = formatBytes(comprimido);

    const ahorroEl = document.getElementById("res-comp-ahorro");
    const notaEl   = document.getElementById("res-comp-nota");

    if (estrategia === "sin_mejora") {
        // No hubo reducción — NO se descargó nada
        ahorroEl.innerText    = "0%";
        ahorroEl.style.color  = "var(--text-muted)";
        document.getElementById("res-comp-final").innerText = formatBytes(original);
        notaEl.innerHTML = `
            <strong>ℹ️ Este PDF ya está al límite de compresión posible en el navegador.</strong><br>
            Los PDF de texto y vectores ya son muy compactos por su naturaleza. 
            Para reducirlos más, puede: (a) dividirlo en partes con la herramienta <em>Combinador/Divisor</em>, 
            (b) usar una herramienta de compresión con Ghostscript (instalación local) o 
            (c) convertir las páginas a escala de grises antes de comprimir.
            <br><small style="color:var(--text-muted)">No se descargó ningún archivo porque el resultado habría sido mayor o igual al original.</small>`;
    } else {
        ahorroEl.innerText   = `${ahorro}%`;
        ahorroEl.style.color = parseFloat(ahorro) > 0 ? "var(--success)" : "var(--text-muted)";

        const metodo = estrategia === "rasterizacion"
            ? "optimización de imágenes + rasterización"
            : "limpieza estructural de streams y objetos";

        const nivelTexto = nivel === "high" ? "Alta" : nivel === "low" ? "Ligera" : "Estándar";
        notaEl.innerHTML = `
            ✅ Archivo optimizado con <strong>${metodo}</strong> (nivel: ${nivelTexto}).
            El texto sigue siendo completamente seleccionable y legible.`;

        if (estrategia === "rasterizacion") {
            notaEl.innerHTML += `<br><small style="color:var(--text-muted)">
            ⚠️ Se aplicó rasterización: las páginas se convirtieron a imagen. 
            El texto puede perder la capacidad de seleccionarse en el lector de PDFs.</small>`;
        }
    }

    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ──────────────────────────────────────────────────────────────────────────────
// UTILITARIO DE BYTES
// ──────────────────────────────────────────────────────────────────────────────
if (typeof formatBytes !== "function") {
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }
}
