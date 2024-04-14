const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del usuario
const playListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const PlayList = mongoose.model("PlayList", playListSchema);
module.exports = { PlayList };
