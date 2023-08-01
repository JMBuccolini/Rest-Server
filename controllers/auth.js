const bcryptjs = require("bcryptjs");
const generarJWT = require("../middlewares/jwt");
const User = require("../models/usuario");
const { googleVerify } = require("../middlewares/googleVerify");

const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    //constatamos si el email existe
    const usuario = await User.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    //Si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado : false",
      });
    }

    //Verificamos contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

const googleSignin = async (req, res) => {
  const { id_token } = req.body;
  
  try {
    const { correo, nombre, img } = await googleVerify(id_token);
    

    let usuario = await User.findOne({ correo });
    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: "1234567890",
        img,
        google: true,
      };
      usuario = new User(data);
      await usuario.save();
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el admin, usuario bloqueado",
      });
    }

    const token = await generarJWT(usuario.id);

    res.json({
      msg: "Todo bien!",
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Token de Google no es válido",
    });
  }
};

module.exports = { login, googleSignin };
