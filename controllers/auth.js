const bcryptjs = require("bcryptjs");
const generarJWT = require("../middlewares/jwt");
const User = require("../models/usuario");

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
    console.log(error)
  }
};

module.exports = { login };
