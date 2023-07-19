import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { FaSearch } from "react-icons/fa";

function App() {
  const [records, setRecords] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileContent, setPdfFileContent] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Load records from localStorage when component mounts
  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("records"));
    if (storedRecords) {
      setRecords(storedRecords);
    }
  }, []);

  // Set up timer to check for expiring records
  useEffect(() => {
    const intervalId = setInterval(() => {
      const expiringRecords = records.filter(
        (record) => record.daysUntilExpiration < 5
      );
      if (expiringRecords.length > 0) {
        swal({
          title: "Registros con menos de 5 dias!",
          text: "Cuidado!",
          icon: "warning",
        });
      }
    }, 1 * 60 * 1000); // 5minutes

    return () => clearInterval(intervalId);
  }, [records]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const record = event.target.record.value;
    const expirationDate = event.target.expirationDate.value;
    const currentDate = new Date();
    const expDate = new Date(expirationDate);
    const timeDiff = expDate.getTime() - currentDate.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Save data to localStorage
    const newRecord = {
      record,
      expirationDate,
      daysUntilExpiration: dayDiff,
      pdfFiles: pdfFileContent
        ? [{ name: pdfFile.name, content: pdfFileContent }]
        : [],
    };
    setRecords([...records, newRecord]);
    localStorage.setItem("records", JSON.stringify([...records, newRecord]));
    // Show success alert
    swal(
      "¡Registro guardado!",
      "El registro se ha guardado correctamente.",
      "success"
    );
    // Clear form inputs
    setRecordValue("");
    setExpirationDateValue("");
    setPdfFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);

    // Read file content
    const reader = new FileReader();
    reader.onloadend = () => {
      setPdfFileContent(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Calculate style for days until expiration
  const getDaysUntilExpirationStyle = (daysUntilExpiration) => {
    if (daysUntilExpiration > 10) {
      return { color: "green" };
    } else {
      return { color: "red" };
    }
  };
  const handleDeleteRecord = (index) => {
    // Show confirmation prompt
    swal({
      title: "¿Está seguro?",
      text: "Una vez eliminado, no podrá recuperar este registro.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Update records state
        const updatedRecords = [...records];
        updatedRecords.splice(index, 1);
        setRecords(updatedRecords);

        // Save records to localStorage
        localStorage.setItem("records", JSON.stringify(updatedRecords));

        swal("¡El registro ha sido eliminado!", {
          icon: "success",
        });
      } else {
        swal("¡El registro está a salvo!");
      }
    });
  };

  // Filter records by search value
  const filteredRecords = records.filter(
    (record) =>
      record.record.toLowerCase().includes(searchValue.toLowerCase()) ||
      record.expirationDate.includes(searchValue)
  );

  // Get current date in yyyy-mm-dd format
  const getCurrentDate = () => {
    const currentDate = new Date();
    let month = "" + (currentDate.getMonth() + 1);
    let day = "" + currentDate.getDate();
    let year = currentDate.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const [recordValue, setRecordValue] = useState("");
  const [expirationDateValue, setExpirationDateValue] = useState("");

  useEffect(() => {
    // Update form validity
    if (pdfFile && recordValue && expirationDateValue) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [pdfFile, recordValue, expirationDateValue]);

  return (
    <div className="flex flex-col items-center bg-gray-300 h-screen">
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Nombre del registro:
          <input
            type="text"
            name="record"
            className="text-black bg-gray-200 ml-1 rounded"
            value={recordValue}
            onChange={(event) => setRecordValue(event.target.value)}
          />
        </label>
        <br />
        <div className="flex flex-col">
          <label className="mt-3 lg:mt-0">
            <span className="bg-red-500  hover:cursor-pointer hover:bg-red-400 text-black font-semibold p-2">
              Subir pdf
            </span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
          <label>
            Fecha de expiración:
            <input
              type="date"
              name="expirationDate"
              min={getCurrentDate()}
              value={expirationDateValue}
              onChange={(event) => setExpirationDateValue(event.target.value)}
            />
          </label>
        </div>
        <br />

        <input
          type="submit"
          value="Guardar"
          disabled={!isFormValid}
          className="bg-red-500 hover:cursor-pointer hover:bg-red-400 text-black font-semibold p-2"
        />
      </form>
      <br />
      <label className="bg-white flex justify-end">
        <h1 className="bg-green-500 uppercase p-3">Buscar</h1>
        <FaSearch size={30} className="absolute mt-2 pr-1" />
        <input
          type="text"
          value={searchValue}
          className="rounded-2xl ml-2"
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </label>

      <table className="">
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
              <td>{record.record}</td>
              <td>{record.expirationDate}</td>
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
}

export default App;
