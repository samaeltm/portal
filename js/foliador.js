/* ==========================================================================
   LÓGICA: FOLIADOR / NUMERADOR DE EXPEDIENTES PDF (CLIENTE SEGURO)
   ========================================================================== */

let selectedPDFFile = null;

// Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("foliador-file-input");
    const fileInfoBox = document.getElementById("file-info-box");
    const fileNameEl = document.getElementById("file-name");
    const btnRemove = document.getElementById("btn-remove-file");
    const btnFoliar = document.getElementById("btn-foliar-pdf");
    
    // Activar selector de archivos al hacer click en la zona de drop
    dropzone.addEventListener("click", () => {
        fileInput.click();
    });

    // Eventos drag and drop
    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });

    // Evento de selección manual
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });

    // Botón remover archivo
    btnRemove.addEventListener("click", (e) => {
        e.stopPropagation(); // Evitar abrir selector de archivos
        removeSelectedFile();
    });

    // Botón procesar / foliar
    btnFoliar.addEventListener("click", () => {
        procesarYDescargarPDF();
    });
});

/**
 * Controla el archivo seleccionado por el usuario.
 */
function handleFileSelection(file) {
    if (file.type !== "application/pdf") {
        alert("Por favor, suba únicamente archivos en formato PDF.");
        return;
    }

    selectedPDFFile = file;

    // Actualizar UI
    const fileInfoBox = document.getElementById("file-info-box");
    const fileNameEl = document.getElementById("file-name");
    const btnFoliar = document.getElementById("btn-foliar-pdf");
    
    fileNameEl.innerText = `${file.name} (${formatBytes(file.size)})`;
    fileInfoBox.classList.add("active");
    btnFoliar.removeAttribute("disabled");
}

/**
 * Remueve el archivo seleccionado actual.
 */
function removeSelectedFile() {
    selectedPDFFile = null;
    document.getElementById("foliador-file-input").value = "";
    document.getElementById("file-info-box").classList.remove("active");
    document.getElementById("btn-foliar-pdf").setAttribute("disabled", "true");
}

/**
 * Auxiliar para dar formato legible al peso del archivo.
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Procesa el PDF usando pdf-lib en el navegador y desencadena la descarga.
 */
async function procesarYDescargarPDF() {
    if (!selectedPDFFile) return;

    const btnFoliar = document.getElementById("btn-foliar-pdf");
    const originalText = btnFoliar.innerHTML;
    
    // Cambiar estado a cargando
    btnFoliar.setAttribute("disabled", "true");
    btnFoliar.innerHTML = `<span class="loading-spinner"></span> Procesando Expediente...`;

    try {
        // Cargar los parámetros de la interfaz
        const startNum = parseInt(document.getElementById("fol-inicio").value, 10) || 1;
        const prefixText = document.getElementById("fol-prefijo").value || "";
        const showTotal = document.getElementById("fol-mostrar-total").checked;
        const excludeFirst = document.getElementById("fol-excluir-primera").checked;
        const position = document.getElementById("fol-posicion").value;
        const fontSize = parseInt(document.getElementById("fol-tamano").value, 10) || 12;
        const textColorHex = document.getElementById("fol-color").value;

        // Leer archivo PDF como ArrayBuffer
        const arrayBuffer = await selectedPDFFile.arrayBuffer();
        
        // Cargar documento con pdf-lib
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        const totalPagesCount = pages.length;

        // Cargar tipografía estándar
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Iterar y rotular cada página del PDF
        for (let i = 0; i < totalPagesCount; i++) {
            // Saltarse la primera página si la opción está activa
            if (excludeFirst && i === 0) {
                continue;
            }

            const page = pages[i];
            const { width, height } = page.getSize();

            // Calcular número de página a imprimir
            // Si excluimos la primera, la página 2 llevará el número startNum
            let currentPageNum = startNum + (excludeFirst ? i - 1 : i);
            
            // Construir texto del folio
            let text = `${prefixText}${currentPageNum}`;
            if (showTotal) {
                const totalCalculado = excludeFirst ? totalPagesCount - 1 : totalPagesCount;
                text += ` de ${startNum + totalCalculado - 1}`;
            }

            // Calcular dimensiones del texto para el posicionamiento
            const textWidth = font.widthOfTextAtSize(text, fontSize);
            const textHeight = font.heightAtSize(fontSize);
            const margin = 30; // Margen de seguridad desde el borde

            let x = 0;
            let y = 0;

            // Determinar coordenadas según la posición seleccionada
            switch (position) {
                case "top-right":
                    x = width - textWidth - margin;
                    y = height - textHeight - margin;
                    break;
                case "bottom-right":
                    x = width - textWidth - margin;
                    y = margin;
                    break;
                case "top-left":
                    x = margin;
                    y = height - textHeight - margin;
                    break;
                case "bottom-left":
                    x = margin;
                    y = margin;
                    break;
            }

            // Mapeo de colores a RGB normalizado (0 a 1)
            let color = rgb(0.09, 0.16, 0.29); // Azul Marino (#172949 aprox)
            if (textColorHex === "black") {
                color = rgb(0, 0, 0); // Negro puro
            } else if (textColorHex === "red") {
                color = rgb(0.8, 0.1, 0.1); // Rojo Judicial
            } else if (textColorHex === "gray") {
                color = rgb(0.3, 0.35, 0.4); // Gris pizarra
            }

            // Escribir el texto sobre la página
            page.drawText(text, {
                x: x,
                y: y,
                size: fontSize,
                font: font,
                color: color
            });
        }

        // Guardar el PDF modificado
        const pdfBytes = await pdfDoc.save();

        // Crear enlace de descarga en cliente
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const downloadUrl = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = downloadUrl;
        
        // Modificar el nombre del archivo original
        const origName = selectedPDFFile.name;
        const newName = origName.toLowerCase().endsWith(".pdf") 
            ? origName.slice(0, -4) + "_foliado.pdf" 
            : origName + "_foliado.pdf";
            
        link.download = newName;
        document.body.appendChild(link);
        link.click();
        
        // Limpieza de memoria
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);

        // Mostrar alerta de éxito
        alert("¡Expediente PDF foliado con éxito! La descarga iniciará automáticamente.");

    } catch (error) {
        console.error("Error al foliar el PDF: ", error);
        alert("Ocurrió un error inesperado al procesar el archivo PDF. Asegúrese de que el archivo no esté protegido con contraseña o dañado.");
    } finally {
        // Restaurar estado del botón
        btnFoliar.removeAttribute("disabled");
        btnFoliar.innerHTML = originalText;
    }
}
