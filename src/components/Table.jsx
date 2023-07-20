import React from "react";

export const Table = ({
  filteredRecords,
  handleDeleteRecord,
  getDaysUntilExpirationStyle,
  daysUntilExpiration,
}) => {
  return (
    <div>
      {" "}
      <table className="rounded-3xl">
        <thead>
          <tr>
            <th>Nombre del registro</th>
            <th>Vencimiento</th>
            <th>Días hasta el vencimiento</th>
            <th>Descargar PDF</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr key={index}>
              <td className="uppercase font-bold">{record.record}</td>
              <td className="uppercase font-bold">{record.expirationDate}</td>
              <td
                className="text-2xl font-extrabold"
                style={getDaysUntilExpirationStyle(record.daysUntilExpiration)}
              >
                {record.daysUntilExpiration}
              </td>
              <td>
                {record.pdfFiles.length > 0 && (
                  <a
                    className="bg-green-500 hover:cursor-pointer hover:bg-green-400 text-black font-semibold p-2"
                    href={record.pdfFiles[0].content}
                    download={record.pdfFiles[0].name}
                  >
                    Descargar
                  </a>
                )}
              </td>
              <td>
                <button
                  className="bg-red-500 hover:bg-red-400 text-black font-semibold p-2"
                  onClick={() => handleDeleteRecord(index)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
