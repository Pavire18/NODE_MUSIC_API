const express = require("express");

// Modelos
const { PlayList } = require("../models/PlayList.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const playLists = await PlayList.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate([{ path: "creator" }, { path: "songs" }]);

    const totalElements = await PlayList.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: playLists,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const playList = await PlayList.findById(id).populate([{ path: "creator" }, { path: "songs" }]);
    if (playList) {
      res.json(playList);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint de creación de canciones
router.post("/", async (req, res) => {
  try {
    const playList = new PlayList(req.body);

    const createdPlayList = await playList.save();
    return res.status(201).json(createdPlayList);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const playListDeleted = await PlayList.findByIdAndDelete(id);
    if (playListDeleted) {
      res.json(playListDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const playListUpdated = await PlayList.findByIdAndUpdate(id, req.body, { new: true });
    if (playListUpdated) {
      res.json(playListUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id/song", async (req, res) => {
  try {
    const id = req.params.id;
    const song = req.body.song;
    const playList = await PlayList.findById(id);

    if (playList) {
      const ids = playList.songs.map((id) => id.valueOf());
      if (ids.indexOf(song) !== -1) {
        playList.songs.splice(ids.indexOf(song), 1);
        const playListSongs = await playList.save();
        res.json(playListSongs);
      } else {
        res.status(409).json({ error: "La canción no está en la lista de reproducción." });
      }
    } else {
      res.status(404).json({ error: "La lista de reproducción no fue encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
  }
});

router.post("/:id/song", async (req, res) => {
  try {
    const id = req.params.id;
    const song = req.body.song;
    const playList = await PlayList.findById(id);

    if (playList) {
      const ids = playList.songs.map((id) => id.valueOf());
      if (ids.indexOf(song) === -1) {
        playList.songs.push(song);
        const playListSongs = await playList.save();
        res.json(playListSongs);
      } else {
        res.status(409).json({ error: "La canción ya está en la lista de reproducción." });
      }
    } else {
      res.status(404).json({ error: "La lista de reproducción no fue encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
  }
});

module.exports = { playListRouter: router };
