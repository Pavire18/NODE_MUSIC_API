const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { faker } = require("@faker-js/faker");
const { Artist } = require("../models/Artist.js");

const artistList = [];

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Creamos artistas adicionales
for (let i = 0; i < 50; i++) {
  const newArtist = {
    name: faker.person.firstName(),
    genre: faker.music.genre(),
    activeSince: randomNumber(1900, new Date().getFullYear()),
    country: faker.location.country(),
  };
  artistList.push(newArtist);
}

async function populateArtist() {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await Artist.collection.drop();
    console.log("Artistas eliminados");

    // Añadimos artistas
    const documents = artistList.map((user) => new Artist(user));
    await Artist.insertMany(documents);
    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
}

populateArtist();
