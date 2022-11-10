import React from "react";
import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Name from "./components/Name";
import Number from "./components/Number";
import PersonToShow from "./components/PersonToShow";
import numbersService from "./services/numbers";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [messageStyle, setMessageStyle] = useState(null);

  const hookEffect = () => {
    numbersService.getAll().then((initialNumbers) => {
      setPersons(initialNumbers);
    });
  };

  useEffect(hookEffect, []);

  const addPerson = (event) => {
    event.preventDefault();

    const foundPerson = persons.find((person) => person.name === newName);

    if (foundPerson) {
      const message = `${newName} is already added to phonebook. Replace old number with a new one?`;

      const confirm = window.confirm(message);

      if (confirm) {
        const newPerson = { name: newName, number: newNumber };

        numbersService
          .updateNumber(foundPerson.id, newPerson)
          .then((returnedPerson) => {
            successMessage(newPerson);

            setPersons(
              persons.map((person) =>
                person.id !== foundPerson.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            errorMessage(foundPerson);
            setNewName("");
            setNewNumber("");
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      numbersService.create(newPerson).then((returnedNumber) => {
        successMessage(newPerson);

        setPersons(persons.concat(returnedNumber));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const successMessage = (person) => {
    setMessageStyle({ color: "green" });
    setMessage(`Person '${person.name}' added to Phonebook!`);
    setTimeout(() => {
      setMessage(null);
      setMessageStyle(null);
    }, 5000);
  };

  const errorMessage = (person) => {
    setMessageStyle({ color: "red" });
    setMessage(
      `Information of '${person.id}' has already been removed from the server.`
    );
    setTimeout(() => {
      setMessage(null);
      setMessageStyle(null);
    }, 5000);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter))
    : persons;

  const deleteNumber = (id) => {
    const number = persons.find((person) => person.id === id);
    const message = `Delete ${number.name}?`;

    const confirm = window.confirm(message);
    if (confirm) {
      numbersService
        .cancelNumber(number.id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== number.id));
        })
        .catch((error) => {
          errorMessage(number);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} customStyle={messageStyle} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new </h2>
      <form onSubmit={addPerson}>
        <Name newName={newName} handleNameChange={handleNameChange} />
        <Number newNumber={newNumber} handleNumberChange={handleNumberChange} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((person) => (
          <PersonToShow
            key={person.name}
            person={person}
            deleteNumber={() => deleteNumber(person.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
