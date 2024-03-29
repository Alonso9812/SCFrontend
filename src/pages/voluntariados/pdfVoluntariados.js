import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePdfReport(data, searchTerm, usuarios) {
    const doc = new jsPDF({ orientation: "landscape" });
    const fechaHora = new Date().toLocaleString();
    let consecutivo = localStorage.getItem("consecutivo");
    if (!consecutivo) {
      consecutivo = 1;
    } else {
      consecutivo = parseInt(consecutivo) + 1;
    }
    localStorage.setItem("consecutivo", consecutivo);

    // Encabezado
    //const imgData = "/src/assets/img/SENDERO-CORNIZUELO.webp";
    //doc.addImage(imgData, "PNG", 230, 5, 60, 30);

    doc.setTextColor(8, 117, 119); // Color verde para el encabezado
    doc.setFont("helvetica", "bold"); // Fuente y estilo para el encabezado
    doc.setFontSize(16); // Tamaño de letra para el encabezado
    doc.text("Sendero el Cornizuelo", 120, 15);
    doc.setFont("helvetica", "normal"); // Restaurar la fuente normal
    doc.setFontSize(12); // Restaurar el tamaño de letra

    doc.setTextColor(0); // Restaurar el color de texto a negro para el resto del documento
    doc.text("REGISTRO DE PARTICIPANTES", 20, 20);
    doc.text(`Fecha y hora de generación: ${fechaHora}`, 20, 30);
    doc.text(`Consecutivo: ${consecutivo}`, 20, 40);

    // Tabla de datos
    const filteredData = searchTerm
      ? data.filter((UsuVol) => UsuVol.voluntariado_id.toString() === searchTerm)
      : data;

    const tableData = [];
    filteredData.forEach((UsuVol) => {
      tableData.push([
        UsuVol.voluntariado_id,
        usuarios.length > 0 ? (
          usuarios.find((user) => user.id === UsuVol.users_id) ? (
            usuarios.find((user) => user.id === UsuVol.users_id).cedula
          ) : (
            "Cédula No Encontrada"
          )
          ) : "Loading...",
      ]);
    });

    const startY = 50; // Posición vertical de inicio de la tabla

    doc.autoTable({
      head: [
        [
          "ID Voluntariado",
          "Cedula Participante",
        ],
      ],
      body: tableData,
      startY: startY,
      margin: { left: 10 }, // Establece el margen izquierdo en 10 (en unidades de medida de jsPDF)
      tableWidth: 'auto', // Ancho de la tabla ajustado automáticamente
      styles: {
        cellPadding: 0.5,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: [0, 0, 0],
        fontSize: 12,
        halign: "center",
        valign: "middle",
        cellWidth: "auto",
        overflow: "linebreak",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 12,
        halign: "center",
        valign: "middle",
        cellWidth: "auto",
        overflow: "linebreak",
      },
    });

    doc.save("reporte_de_participantes.pdf");
  };