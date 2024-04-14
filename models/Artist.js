const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del usuario
const artistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    activeSince: {
      type: Date,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Artist = mongoose.model("Artist", artistSchema);
module.exports = { Artist };
