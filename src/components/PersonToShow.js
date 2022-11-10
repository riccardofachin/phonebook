import React from "react";

const PersonToShow = ({ person, deleteNumber }) => {
  return (
    <>
      <li>
        {person.name} {person.number}
        <button onClick={deleteNumber}>Delete</button>
      </li>
    </>
  );
};

export default PersonToShow;
