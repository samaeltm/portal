/* ==========================================================================
   LÓGICA: ESTAMPADOR DE FIRMA Y SELLO DIGITAL EN PDF (CLIENTE SEGURO)
   ========================================================================== */

let pdfFileToSign = null;
let sealImageFile = null;
let drawingCanvas = null;
let canvasContext = null;
let isDrawing = false;

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar Canvas de Dibujo
    drawingCanvas = document.getElementById("firma-canvas");
    if (drawingCanvas) {
        canvasContext = drawingCanvas.getContext("2d");
        setupCanvasDrawing();
    }

    // Eventos de selección de PDF
    const signInput = document.getElementById("sign-file-input");
    const signDropzone = document.getElementById("sign-dropzone");
    const signInfoBox = document.getElementById("sign-file-info");
    const btnRemoveSignFile = document.getElementById("btn-remove-sign-file");

    if (signDropzone && signInput) {
        signDropzone.addEventListener("click", () => signInput.click());
        signDropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            signDropzone.classList.add("dragover");
        });
        signDropzone.addEventListener("dragleave", () => signDropzone.classList.remove("dragover"));
        signDropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            signDropzone.classList.remove("dragover");
            if (e.dataTransfer.files.length > 0) {
                handleFileToSign(e.dataTransfer.files[0]);
            }
        });
        signInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                handleFileToSign(e.target.files[0]);
            }
        });
    }

    if (btnRemoveSignFile) {
        btnRemoveSignFile.addEventListener("click", (e) => {
            e.stopPropagation();
            removerArchivoSign();
        });
    }

    // Eventos de selección de Sello (Imagen opcional)
    const sealInput = document.getElementById("seal-file-input");
    if (sealInput) {
        sealInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                sealImageFile = e.target.files[0];
                document.getElementById("seal-file-name").innerText = sealImageFile.name;
                document.getElementById("seal-info-box").style.display = "flex";
            }
        });
    }

    const btnRemoveSeal = document.getElementById("btn-remove-seal");
    if (btnRemoveSeal) {
        btnRemoveSeal.addEventListener("click", () => {
            sealImageFile = null;
            document.getElementById("seal-file-input").value = "";
            document.getElementById("seal-info-box").style.display = "none";
        });
    }

    // Botón Limpiar Firma Canvas
    const btnClearCanvas = document.getElementById("btn-clear-canvas");
    if (btnClearCanvas) {
        btnClearCanvas.addEventListener("click", clearSignatureCanvas);
    }

    // Botón Estampar y Guardar PDF
    const btnStamp = document.getElementById("btn-stamp-pdf");
    if (btnStamp) {
        btnStamp.addEventListener("click", ejecutarEstampadoFirma);
    }
});

/**
 * Configura los eventos del ratón y táctiles para dibujar en el Canvas.
 */
function setupCanvasDrawing() {
    canvasContext.strokeStyle = "#000000"; // Negro por defecto para la firma
    canvasContext.lineWidth = 2.5;
    canvasContext.lineCap = "round";
    canvasContext.lineJoin = "round";

    // Ratón
    drawingCanvas.addEventListener("mousedown", startDrawing);
    drawingCanvas.addEventListener("mousemove", draw);
    drawingCanvas.addEventListener("mouseup", stopDrawing);
    drawingCanvas.addEventListener("mouseout", stopDrawing);

    // Táctil (Móviles / Tablets)
    drawingCanvas.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        const rect = drawingCanvas.getBoundingClientRect();
        startDrawing({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        e.preventDefault();
    });

    drawingCanvas.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        draw({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        e.preventDefault();
    });

    drawingCanvas.addEventListener("touchend", stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = drawingCanvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = drawingCanvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    canvasContext.lineTo(x, y);
    canvasContext.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function clearSignatureCanvas() {
    if (canvasContext && drawingCanvas) {
        canvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
}

function handleFileToSign(file) {
    if (file.type !== "application/pdf") {
        alert("Por favor, cargue únicamente archivos PDF.");
        return;
    }

    pdfFileToSign = file;
    document.getElementById("sign-file-name").innerText = `${file.name} (${formatBytes(file.size)})`;
    document.getElementById("sign-file-info").classList.add("active");
    document.getElementById("btn-stamp-pdf").removeAttribute("disabled");
}

function removerArchivoSign() {
    pdfFileToSign = null;
    document.getElementById("sign-file-input").value = "";
    document.getElementById("sign-file-info").classList.remove("active");
    document.getElementById("btn-stamp-pdf").setAttribute("disabled", "true");
}

/**
 * Estampa la firma dibujada o el sello sobre el documento PDF.
 */
async function ejecutarEstampadoFirma() {
    if (!pdfFileToSign) return;

    // Verificar que se haya dibujado una firma o cargado un sello
    const isCanvasEmpty = checkIsCanvasEmpty(drawingCanvas);
    if (isCanvasEmpty && !sealImageFile) {
        alert("Por favor, dibuje una firma en el recuadro o suba una imagen de sello.");
        return;
    }

    const btnStamp = document.getElementById("btn-stamp-pdf");
    const originalHTML = btnStamp.innerHTML;
    btnStamp.setAttribute("disabled", "true");
    btnStamp.innerHTML = `<span class="loading-spinner"></span> Estampando Rúbricas...`;

    try {
        const { PDFDocument, rgb } = PDFLib;
        const arrayBuffer = await pdfFileToSign.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        const pageCount = pages.length;

        // Parámetros de la interfaz
        const targetPageNum = parseInt(document.getElementById("sign-pagina").value, 10) || 1;
        const position = document.getElementById("sign-posicion").value;
        const sizeOption = document.getElementById("sign-tamano").value; // "small" | "medium" | "large"

        if (targetPageNum < 1 || targetPageNum > pageCount) {
            alert(`La página solicitada (${targetPageNum}) está fuera de rango. El documento tiene ${pageCount} páginas.`);
            btnStamp.removeAttribute("disabled");
            btnStamp.innerHTML = originalHTML;
            return;
        }

        const targetPage = pages[targetPageNum - 1];
        const { width, height } = targetPage.getSize();

        // Determinar tamaños
        let sigWidth = 150;
        let sigHeight = 75;
        if (sizeOption === "small") {
            sigWidth = 100;
            sigHeight = 50;
        } else if (sizeOption === "large") {
            sigWidth = 220;
            sigHeight = 110;
        }

        const margin = 40;
        let x = 0;
        let y = 0;

        // Calcular posición
        switch (position) {
            case "bottom-right":
                x = width - sigWidth - margin;
                y = margin;
                break;
            case "bottom-left":
                x = margin;
                y = margin;
                break;
            case "top-right":
                x = width - sigWidth - margin;
                y = height - sigHeight - margin;
                break;
            case "top-left":
                x = margin;
                y = height - sigHeight - margin;
                break;
            case "center":
                x = (width - sigWidth) / 2;
                y = (height - sigHeight) / 2;
                break;
        }

        // A. ESTAMPAR FIRMA DIBUJADA
        if (!isCanvasEmpty) {
            // Exportar firma dibujada del canvas como PNG base64
            const dataUrl = drawingCanvas.toDataURL("image/png");
            const sigBytes = await fetch(dataUrl).then(res => res.arrayBuffer());
            const embeddedSig = await pdfDoc.embedPng(sigBytes);

            targetPage.drawImage(embeddedSig, {
                x: x,
                y: y,
                width: sigWidth,
                height: sigHeight
            });
        }

        // B. ESTAMPAR SELLO (IMAGEN SUBIDA)
        if (sealImageFile) {
            const sealArrayBuffer = await sealImageFile.arrayBuffer();
            let embeddedSeal = null;

            // Identificar tipo de imagen
            if (sealImageFile.type === "image/png") {
                embeddedSeal = await pdfDoc.embedPng(sealArrayBuffer);
            } else {
                embeddedSeal = await pdfDoc.embedJpg(sealArrayBuffer);
            }

            // Desplazar el sello ligeramente para que no se superponga exactamente a la firma
            // Si hay ambos, colocamos el sello a la izquierda de la firma
            let sealX = x;
            let sealY = y;
            if (!isCanvasEmpty) {
                if (x > margin) {
                    sealX = x - sigWidth - 20; // Al lado izquierdo
                } else {
                    sealX = x + sigWidth + 20; // Al lado derecho
                }
            }

            targetPage.drawImage(embeddedSeal, {
                x: sealX,
                y: sealY,
                width: sigWidth, // Mismo tamaño para simetría
                height: sigWidth
            });
        }

        const signedBytes = await pdfDoc.save();

        // Descarga
        const blob = new Blob([signedBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        
        const origName = pdfFileToSign.name;
        const newName = origName.toLowerCase().endsWith(".pdf") 
            ? origName.slice(0, -4) + "_firmado.pdf" 
            : origName + "_firmado.pdf";

        link.download = newName;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert("¡Firma y sellos estampados con éxito!");

    } catch (error) {
        console.error("Error al estampar firma: ", error);
        alert("Ocurrió un error al intentar estampar la firma digital. Verifique el estado de su archivo.");
    } finally {
        btnStamp.removeAttribute("disabled");
        btnStamp.innerHTML = originalHTML;
    }
}

/**
 * Verifica si el canvas está vacío (sin dibujos).
 */
function checkIsCanvasEmpty(canvas) {
    if (!canvas) return true;
    const blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
}

/**
 * Reutiliza el formateador de bytes.
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
