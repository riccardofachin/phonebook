import React from "react";

const Number = ({ newNumber, handleNumberChange }) => {
  return (
    <>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
    </>
  );
};

export default Number;
