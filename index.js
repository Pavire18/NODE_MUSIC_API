const express = require("express");
const { userRouter } = require("./routes/user.routes.js");
const { artistRouter } = require("./routes/artist.routes.js");
const { songRouter } = require("./routes/song.routes.js");
const { playListRouter } = require("./routes/playList.routes.js");

const main = async () => {
  // Conexión a la BBDD
  const { connect } = require("./db.js");
  const database = await connect();

  // Creamos router de expres
  const PORT = 3000;
  const server = express();
  const router = express.Router();

  // Configuración del server
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));

  // Rutas
  router.get("/", (req, res) => {
    res.send(`Esta es la home de nuestra API usando BBDD --> ${database.connection.name}`);
  });

  router.get("*", (req, res) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  server.use("/user", userRouter);
  server.use("/artist", artistRouter);
  server.use("/song", songRouter)
  server.use("/playList", playListRouter)
  server.use("/", router);

  server.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};

main();
