import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePdfReport(data, searchTerm) {

    const doc = new jsPDF({ orientation: "landscape" });
    
    const fechaHora = new Date().toLocaleString();
    let consecutivo = localStorage.getItem("consecutivo");
    if (!consecutivo) {
        consecutivo = 1;
    } else {
        consecutivo = parseInt(consecutivo) + 1;
    }
    localStorage.setItem("consecutivo", consecutivo);

    const filteredData = searchTerm
      ? data.filter((solicitud) => solicitud.id.toString().includes(searchTerm))
      : data;

    filteredData.forEach((solicitud, index) => {
        if (index > 0) {
            doc.addPage(); // Añadir nueva página para cada solicitud
        }

        // Encabezado
        //const imgData = "/src/assets/img/SENDERO-CORNIZUELO.png";
        //doc.addImage(imgData, "PNG", 140, 4, 60, 30);
        doc.setTextColor(8, 117, 119); // Color verde para el encabezado
        doc.setFont("helvetica", "bold"); // Fuente y estilo para el encabezado
        doc.setFontSize(16); // Tamaño de letra para el encabezado
        doc.text("Sendero el Cornizuelo", 10, 10);
        doc.text("Reporte de Solicitudes", 10, 20);
        doc.text(`Fecha y hora de generación: ${fechaHora}`, 10, 30);
        doc.text(`Consecutivo: ${consecutivo}`, 10, 40);
        doc.setFont("helvetica", "normal"); // Restaurar la fuente normal
        doc.setFontSize(12); // Restaurar el tamaño de letra

        doc.setTextColor(0); // Restaurar el color de texto a negro para el resto del documento

        // Datos de la solicitud
        const tableData = [
            ["ID Solicitud", solicitud.id],
            ["Nombre Solicitante", solicitud.nomSoli],
            ["Primer Apellido", solicitud.apellSoli1],
            ["Segundo Apellido", solicitud.apellSoli2],
            ["Número", solicitud.numSoli],
            ["Correo", solicitud.email],
            ["Título Solicitud", solicitud.tituloVC],
            ["Descripción", solicitud.descripVC],
            ["Lugar", solicitud.lugarVC],
            ["Alimentación", solicitud.alimentacion],
            ["Tipo Solicitud", solicitud.tipoSoli],
            ["Fecha Solicitada", solicitud.fechaSoli],
            ["Estado", solicitud.statusSoli]
        ];

        let currentY = 50;
        tableData.forEach(([label, value]) => {
            const splitText = doc.splitTextToSize(`${label}: ${value}`, 180); // Dividir texto si es demasiado largo
            doc.text(splitText, 10, currentY);
            currentY += 10 * splitText.length; // Ajustar la posición en función del texto dividido
        });
    });

    doc.save("reporte_de_solicitudes.pdf");
};
