const User = require("../models/usuario");
const bcryptjs = require("bcryptjs");

const usuariosGet = async (req, res) => {
  // const usuarios = await User.find();
  const {limite=2, desde=0} = req.query;

  const filter = {estado: true};

  const [total, usuarios] = await Promise.all([ User.countDocuments(filter),User.find(filter).skip(Number(desde)).limit(Number(limite))])

  res.json({
    msg: "Estos son los usuarios en la DB",
    total,
    usuarios,
  });
};

const usuariosSaludo = (req, res) => {
  const { nombre, apellido } = req.params;

  res.json({
    msg: `Hola ${nombre} ${apellido}!`,
  });
};

const usuariosList = (req, res) => {
  const body = req.body;

  res.json({
    listaDeCompras: body,
  });
};

const usuariosStatus = (req, res) => {
  const nombre = req.body.nombre;

  res.json({
    nombre,
    status: "success",
  });
};

const usuariosPut = async (req, res) => {
  const { id } = req.params;
  
  const { _id, password, google, nombre, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  console.log(resto);
  const usuario = await User.findByIdAndUpdate( id,{$set: {resto,nombre:nombre}} );

  res.json({
    msg: "Usuario actualizado con éxito",
    usuario
  });
};

const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  const newUser = new User({ nombre, correo, password, rol });

  const salt = bcryptjs.genSaltSync();

  newUser.password = bcryptjs.hashSync(password, salt);

  await newUser.save();

  res.json({
    msg: "Usuario agregado a la DB correctamente",
    newUser,
  });
};

const usuariosDelete = async (req, res) => {

  const {id} = req.params
  //  const usuario = await User.findByIdAndDelete(id)
  const usuario= await User.findByIdAndUpdate(id, {estado:false})
  res.json({
    msg: "Usuario borrado con éxito",
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosSaludo,
  usuariosList,
  usuariosStatus,
};


