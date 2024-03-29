/* eslint-disable no-undef */
import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePdfReport(filteredData) {
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
  //const imgData = "/src/assets/img/SENDERO-CORNIZUELO.png";
  //doc.addImage(imgData, "PNG", 230, 5, 60, 30);

  doc.text("Sendero el Cornizuelo", 120, 15);
  doc.text("Reporte de reservaciones", 20, 20);
  doc.text(`Fecha y hora de generación: ${fechaHora}`, 20, 30);
  doc.text(`Consecutivo: ${consecutivo}`, 20, 40);

  // Tabla de datos
  const tableData = [];
  filteredData.forEach((reservacion) => {
    tableData.push([
      reservacion.id,
      reservacion.nombreVis,
      reservacion.apell1Vis,
      reservacion.apell2Vis,
      reservacion.cedulaVis,
      reservacion.fechaReserva,
      reservacion.cupo,
      reservacion.telefonoVis,
      reservacion.email,
      reservacion.status,
    ]);
  });

  const startY = 50; // Posición vertical de inicio de la tabla

  doc.autoTable({
    head: [
      [
        "ID",
        "Nombre",
        "Primer Apellido",
        "Segundo Apellido",
        "Cédula",
        "Fecha de Reserva",
        "Cupo",
        "Teléfono",
        "Email",
        "Estado",
      ],
    ],
    body: tableData,
    startY: startY,
    margin: { left: 10 }, // Establece el margen izquierdo en 5 (en unidades de medida de jsPDF)
    tableWidth: "wrap", // Ancho de la tabla ajustado al contenido
    styles: {
      cellPadding: 0.6,
      lineWidth: 0.2,
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [34, 139, 34],
      textColor: [0, 0, 0],
      fontSize: 12,
      halign: "center",
      valign: "middle",
      cellWidth: "wrap",
      overflow: "linebreak",
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      fontSize: 12,
      halign: "center",
      valign: "middle",
      cellWidth: "wrap",
      overflow: "linebreak",
    },
    columnStyles: {
      // Ajustar el ancho de las columnas según el contenido
      "*": { cellWidth: "auto" },
    },
  });

  doc.save("reporte_de_reservaciones.pdf");
}
