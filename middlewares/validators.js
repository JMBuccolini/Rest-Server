const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/usuario");

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  next();
};

const emailExiste = async (correo) => {
  const usuario = await User.findOne({ correo });
  if (usuario) {
    throw new Error("El correo electrónico ya está registrado");
  }
};

const existeUsuarioPorId = async (id) => {
  const usuario = await User.findById(id);
  if (!usuario) {
    throw new Error("El usuario no existe");
  }
};

const validarJWT = async (req, res, next) => {
  const token = req.header("x-token");//así lo llamamos en nuestro encabezado para obtener la información del token
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    //leer el usuario que corresponde al uid

    const usuario = await User.findById(uid);
    if (!usuario) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existe en la DB",
      });
    }

    //Verificar si el uid tiene estado true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido - usuario con estado: false",
      });
    }

    req.usuario = usuario; //esto permite que otros middlewares o controladores de la cadena accedan a la info de usuario

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validarCampos,
  existeUsuarioPorId,
  emailExiste,
  validarJWT
};
