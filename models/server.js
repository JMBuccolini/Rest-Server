const express = require("express");
const cors = require("cors"); //Middleware que permite el intercambio de información de origen cruzado.
const dbConnection = require('../database/database')


class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";
    this.mathPath = "/api/math";
    this.authPath = "/api/auth";

    //Middlewares
    this.middlewares();
    //Rutas de mi app
    this.routes();
    //Se inicia la base de datos
    this.conectarDB();
  }

  async conectarDB(){
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json()); //La información traída por body es parseada a un json

    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usuariosPath,require('../routes/usuarios'));
    this.app.use(this.mathPath, require('../routes/maths'));
    this.app.use(this.authPath, require('../routes/usuarios'));

  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto ", this.port);
    });
  }
}


module.exports = Server;