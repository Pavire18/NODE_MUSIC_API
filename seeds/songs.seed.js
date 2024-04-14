const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { faker } = require("@faker-js/faker");
const { Song } = require("../models/Song.js");
const { Artist } = require("../models/Artist.js");

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function populateUsers() {
  try {
    await connect();
    console.log("Tenemos conexión");

    const artist = await Artist.find();

    const songList = [];

    // Creamos autores adicionales
    for (let i = 0; i < 50; i++) {
      const newSong = {
        title: faker.music.songName(),
        duration: faker.number.int(),
        releaseYear: randomNumber(1900, new Date().getFullYear()),
        artist: artist[randomNumber(0, artist.length - 1)].id
      };
      songList.push(newSong);
    }

    // Borrar datos
    await Song.collection.drop();
    console.log("Canciones eliminados");

    // Añadimos usuarios
    const documents = songList.map((song) => new Song(song));
    await Song.insertMany(documents);
    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
}

populateUsers();
