import React, { useState, useEffect } from "react";
import swal from "sweetalert";

import { Form } from "./components/Form";
import { Searchbar } from "./components/Searchbar";
import { Table } from "./components/Table";

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
    <div className="flex flex-col items-center bg-blue-400 h-screen">
      <br />
      <Form
        handleSubmit={handleSubmit}
        isFormValid={isFormValid}
        handleFileChange={handleFileChange}
        getCurrentDate={getCurrentDate}
        expirationDateValue={expirationDateValue}
        setExpirationDateValue={setExpirationDateValue}
        setRecordValue={setRecordValue}
      />
      <br />
      <Searchbar searchValue={searchValue} setSearchValue={setSearchValue} />

      <Table
        filteredRecords={filteredRecords}
        handleDeleteRecord={handleDeleteRecord}
        getDaysUntilExpirationStyle={getDaysUntilExpirationStyle}
      />
    </div>
  );
}

export default App;
