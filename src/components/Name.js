import React from "react";

const Name = ({ newName, handleNameChange }) => {
  return (
    <>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
    </>
  );
};

export default Name;
