import React from "react";

export const Form = ({
  handleSubmit,
  recordValue,
  handleFileChange,
  setRecordValue,
  getCurrentDate,
  expirationDateValue,
  setExpirationDateValue,
  isFormValid,
}) => {
  return (
    <div>
      {" "}
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
    </div>
  );
};
