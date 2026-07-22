/* ==========================================================================
   LÓGICA: COMBINADOR Y DIVISOR DE PIEZAS JURÍDICAS (PDF-MERGE/SPLIT)
   ========================================================================== */

let pdfFilesToMerge = [];
let pdfFileToSplit = null;

document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------------------
    // EVENTOS COMBINADOR (MERGE)
    // ---------------------------------------------
    const mergeInput = document.getElementById("merge-file-input");
    const mergeDropzone = document.getElementById("merge-dropzone");
    const mergeList = document.getElementById("merge-files-list");
    const btnMerge = document.getElementById("btn-merge-pdf");

    if (mergeDropzone && mergeInput) {
        mergeDropzone.addEventListener("click", () => mergeInput.click());
        mergeDropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            mergeDropzone.classList.add("dragover");
        });
        mergeDropzone.addEventListener("dragleave", () => mergeDropzone.classList.remove("dragover"));
        mergeDropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            mergeDropzone.classList.remove("dragover");
            handleFilesToMerge(e.dataTransfer.files);
        });
        mergeInput.addEventListener("change", (e) => {
            handleFilesToMerge(e.target.files);
        });
    }

    if (btnMerge) {
        btnMerge.addEventListener("click", combinarArchivosPDF);
    }

    // ---------------------------------------------
    // EVENTOS DIVISOR (SPLIT)
    // ---------------------------------------------
    const splitInput = document.getElementById("split-file-input");
    const splitDropzone = document.getElementById("split-dropzone");
    const splitInfoBox = document.getElementById("split-file-info");
    const splitFileName = document.getElementById("split-file-name");
    const btnRemoveSplit = document.getElementById("btn-remove-split-file");
    const btnSplit = document.getElementById("btn-split-pdf");

    if (splitDropzone && splitInput) {
        splitDropzone.addEventListener("click", () => splitInput.click());
        splitDropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            splitDropzone.classList.add("dragover");
        });
        splitDropzone.addEventListener("dragleave", () => splitDropzone.classList.remove("dragover"));
        splitDropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            splitDropzone.classList.remove("dragover");
            if (e.dataTransfer.files.length > 0) {
                handleFileToSplit(e.dataTransfer.files[0]);
            }
        });
        splitInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                handleFileToSplit(e.target.files[0]);
            }
        });
    }

    if (btnRemoveSplit) {
        btnRemoveSplit.addEventListener("click", (e) => {
            e.stopPropagation();
            removerArchivoSplit();
        });
    }

    if (btnSplit) {
        btnSplit.addEventListener("click", dividirArchivoPDF);
    }
});

// ---------------------------------------------
// FUNCIONES COMBINADOR (MERGE)
// ---------------------------------------------
function handleFilesToMerge(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === "application/pdf") {
            pdfFilesToMerge.push(file);
        }
    }
    renderMergeList();
}

function renderMergeList() {
    const listContainer = document.getElementById("merge-files-list");
    const btnMerge = document.getElementById("btn-merge-pdf");
    
    listContainer.innerHTML = "";
    
    if (pdfFilesToMerge.length === 0) {
        listContainer.style.display = "none";
        btnMerge.setAttribute("disabled", "true");
        return;
    }

    listContainer.style.display = "flex";
    listContainer.style.flexDirection = "column";
    listContainer.style.gap = "8px";
    btnMerge.removeAttribute("disabled");

    pdfFilesToMerge.forEach((file, index) => {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.padding = "10px 14px";
        item.style.backgroundColor = "var(--bg-main)";
        item.style.border = "1px solid var(--border)";
        item.style.borderRadius = "6px";
        item.style.fontSize = "0.85rem";

        const info = document.createElement("span");
        info.innerHTML = `<strong>${index + 1}.</strong> ${file.name} <span style="color:var(--text-muted); margin-left:8px;">(${formatBytes(file.size)})</span>`;

        const actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.gap = "8px";

        // Botón Subir
        if (index > 0) {
            const btnUp = document.createElement("button");
            btnUp.innerText = "▲";
            btnUp.style.border = "none";
            btnUp.style.background = "none";
            btnUp.style.cursor = "pointer";
            btnUp.style.color = "var(--secondary)";
            btnUp.addEventListener("click", (e) => {
                e.stopPropagation();
                moveItemInMergeList(index, index - 1);
            });
            actions.appendChild(btnUp);
        }

        // Botón Bajar
        if (index < pdfFilesToMerge.length - 1) {
            const btnDown = document.createElement("button");
            btnDown.innerText = "▼";
            btnDown.style.border = "none";
            btnDown.style.background = "none";
            btnDown.style.cursor = "pointer";
            btnDown.style.color = "var(--secondary)";
            btnDown.addEventListener("click", (e) => {
                e.stopPropagation();
                moveItemInMergeList(index, index + 1);
            });
            actions.appendChild(btnDown);
        }

        // Botón Eliminar
        const btnDel = document.createElement("button");
        btnDel.innerText = "Eliminar";
        btnDel.style.border = "none";
        btnDel.style.background = "none";
        btnDel.style.color = "#EF4444";
        btnDel.style.cursor = "pointer";
        btnDel.style.fontWeight = "600";
        btnDel.addEventListener("click", (e) => {
            e.stopPropagation();
            pdfFilesToMerge.splice(index, 1);
            renderMergeList();
        });
        
        actions.appendChild(btnDel);
        item.appendChild(info);
        item.appendChild(actions);
        listContainer.appendChild(item);
    });
}

function moveItemInMergeList(fromIndex, toIndex) {
    const element = pdfFilesToMerge.splice(fromIndex, 1)[0];
    pdfFilesToMerge.splice(toIndex, 0, element);
    renderMergeList();
}

async function combinarArchivosPDF() {
    if (pdfFilesToMerge.length < 2) {
        alert("Por favor, agregue al menos 2 archivos PDF para poder combinarlos.");
        return;
    }

    const btnMerge = document.getElementById("btn-merge-pdf");
    const originalHTML = btnMerge.innerHTML;
    btnMerge.setAttribute("disabled", "true");
    btnMerge.innerHTML = `<span class="loading-spinner"></span> Combinando Archivos...`;

    try {
        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();

        for (let i = 0; i < pdfFilesToMerge.length; i++) {
            const file = pdfFilesToMerge[i];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const indices = pdfDoc.getPageIndices();
            const copiedPages = await mergedPdf.copyPages(pdfDoc, indices);
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();

        // Descarga
        const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Expediente_Combinado.pdf";
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert("¡Archivos PDF combinados con éxito!");
    } catch (error) {
        console.error("Error al combinar PDFs: ", error);
        alert("Ocurrió un error al intentar combinar los archivos. Verifique que no estén dañados ni protegidos.");
    } finally {
        btnMerge.removeAttribute("disabled");
        btnMerge.innerHTML = originalHTML;
    }
}

// ---------------------------------------------
// FUNCIONES DIVISOR (SPLIT)
// ---------------------------------------------
function handleFileToSplit(file) {
    if (file.type !== "application/pdf") {
        alert("Por favor, cargue únicamente archivos PDF.");
        return;
    }

    pdfFileToSplit = file;
    document.getElementById("split-file-name").innerText = `${file.name} (${formatBytes(file.size)})`;
    document.getElementById("split-file-info").classList.add("active");
    document.getElementById("btn-split-pdf").removeAttribute("disabled");
}

function removerArchivoSplit() {
    pdfFileToSplit = null;
    document.getElementById("split-file-input").value = "";
    document.getElementById("split-file-info").classList.remove("active");
    document.getElementById("btn-split-pdf").setAttribute("disabled", "true");
}

async function dividirArchivoPDF() {
    if (!pdfFileToSplit) return;

    const rangeStr = document.getElementById("split-rango").value.trim();
    if (!rangeStr) {
        alert("Por favor, ingrese un rango de páginas válido (ej: 1-3, 5, 8).");
        return;
    }

    const btnSplit = document.getElementById("btn-split-pdf");
    const originalHTML = btnSplit.innerHTML;
    btnSplit.setAttribute("disabled", "true");
    btnSplit.innerHTML = `<span class="loading-spinner"></span> Extrayendo Páginas...`;

    try {
        const { PDFDocument } = PDFLib;
        const arrayBuffer = await pdfFileToSplit.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const totalPages = srcPdf.getPageCount();

        // Parsear el rango de páginas ingresado por el usuario
        const indices = parsePageRange(rangeStr, totalPages);
        if (indices.length === 0) {
            alert("El rango de páginas especificado no es válido o está fuera del límite del archivo.");
            btnSplit.removeAttribute("disabled");
            btnSplit.innerHTML = originalHTML;
            return;
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, indices);
        copiedPages.forEach(page => newPdf.addPage(page));

        const newPdfBytes = await newPdf.save();

        // Descarga
        const blob = new Blob([newPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        
        const origName = pdfFileToSplit.name;
        const newName = origName.toLowerCase().endsWith(".pdf") 
            ? origName.slice(0, -4) + "_extracto.pdf" 
            : origName + "_extracto.pdf";

        link.download = newName;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert("¡Páginas extraídas y guardadas con éxito!");
    } catch (error) {
        console.error("Error al dividir PDF: ", error);
        alert("Ocurrió un error al intentar extraer las páginas. Verifique que la sintaxis del rango de páginas sea correcta.");
    } finally {
        btnSplit.removeAttribute("disabled");
        btnSplit.innerHTML = originalHTML;
    }
}

/**
 * Parsea cadenas del tipo "1-3, 5, 8-10" a un arreglo de índices (0-indexed).
 */
function parsePageRange(rangeStr, totalPages) {
    const indices = [];
    const parts = rangeStr.split(",");

    for (let part of parts) {
        part = part.trim();
        if (part.includes("-")) {
            const bounds = part.split("-");
            if (bounds.length === 2) {
                const start = parseInt(bounds[0], 10);
                const end = parseInt(bounds[1], 10);
                if (!isNaN(start) && !isNaN(end) && start <= end) {
                    // Convertir a índices 0-indexed y verificar límites
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= totalPages) {
                            indices.push(i - 1);
                        }
                    }
                }
            }
        } else {
            const pageNum = parseInt(part, 10);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                indices.push(pageNum - 1);
            }
        }
    }
    
    // Remover duplicados y ordenar ascendentemente
    return [...new Set(indices)].sort((a, b) => a - b);
}

/**
 * Reutiliza el formateador de bytes del foliador si está presente, o declara su versión local.
 */
if (typeof formatBytes !== "function") {
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
