const express = require("express");

// Modelos
const { Artist } = require("../models/Artist.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const artist = await Artist.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Artist.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: artist,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const artist = await Artist.findById(id);
    if (artist) {
      res.json(artist);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint de creación de artistas
router.post("/", async (req, res) => {
  try {
    const artist = new Artist(req.body);

    const createdArtist = await artist.save();
    return res.status(201).json(createdArtist);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const artistDeleted = await Artist.findByIdAndDelete(id);
    if (artistDeleted) {
      res.json(artistDeleted);
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
    const artistUpdated = await Artist.findByIdAndUpdate(id, req.body, { new: true });
    if (artistUpdated) {
      res.json(artistUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = { artistRouter: router };
