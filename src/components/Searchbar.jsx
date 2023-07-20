import React from "react";
import { FaSearch } from "react-icons/fa";

export const Searchbar = ({ searchValue, setSearchValue }) => {
  return (
    <div>
      {" "}
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
    </div>
  );
};
