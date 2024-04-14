const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { faker } = require("@faker-js/faker");
const { User } = require("../models/User.js");

const userList = [
  { name: "Gabriel", surNames: "García Márquez", email: "prueba@gmail.com" },
  { name: "Jane", surNames: "Austen", email: "prueba@gmail.com" },
  { name: "Leo", surNames: "Tolstoy", email: "prueba@gmail.com" }
];

// Creamos autores adicionales
for (let i = 0; i < 50; i++) {
  const newUser = {
    name: faker.person.firstName(),
    surNames: faker.person.lastName() + " " + faker.person.lastName(),
    email: faker.internet.email()
  };
  userList.push(newUser);
}

async function populateUsers() {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await User.collection.drop();
    console.log("Usuarios eliminados");

    // Añadimos usuarios
    const documents = userList.map((user) => new User(user));
    await User.insertMany(documents);
    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
}

populateUsers();
