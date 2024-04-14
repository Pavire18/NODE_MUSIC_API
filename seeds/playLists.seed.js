const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { faker } = require("@faker-js/faker");
const { Song } = require("../models/Song.js");
const { PlayList } = require("../models/PlayList.js");
const { User } = require("../models/User.js");

const generateRandomNumbers = (min, max, count) => {
  const result = [];
  while (result.length < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!result.includes(randomNumber)) {
      result.push(randomNumber);
    }
  }
  if (count === 1) {
    return result[0];
  }

  return result;
};

async function populateUsers() {
  try {
    await connect();
    console.log("Tenemos conexión");
    const users = await User.find();
    const songs = await Song.find();

    const playLists = [];

    // Creamos playlists adicionales
    for (let i = 0; i < 5; i++) {
      const selectedSongs = generateRandomNumbers(0, songs.length - 1, 5);
      const songList = [];
      selectedSongs.forEach((element) => {
        songList.push(songs[element].id);
      });

      const newPlayList = {
        name: faker.lorem.words(),
        songs: songList,
        creator: users[generateRandomNumbers(0, users.length - 1, 1)].id,
      };
      playLists.push(newPlayList);
    }

    // Borrar datos
    await PlayList.collection.drop();
    console.log("Playlists eliminados");

    // Añadimos playLists
    const documents = playLists.map((playList) => new PlayList(playList));
    await PlayList.insertMany(documents);
    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
}

populateUsers();
