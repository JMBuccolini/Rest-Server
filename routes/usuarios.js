const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();

const {
    existeUsuarioPorId,
    emailExiste,
    validarCampos,
    validarJWT
} = require('../middlewares/validators')

const {login} = require('../controllers/auth');



const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosSaludo,
  usuariosList,
  usuariosStatus,
} = require("../controllers/usuarios");

router.get("/", usuariosGet);
router.get("/saludo/:nombre/:apellido", usuariosSaludo);
router.get("/list", usuariosList);
router.post("/status", usuariosStatus);
router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
    validarJWT
  ],
  usuariosPut
);
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe tener más de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(emailExiste),
    validarCampos
  ],
  usuariosPost
);

router.post('/login', [
  check('correo', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos,
], login);




router.delete(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
    validarJWT
  ],
  usuariosDelete
);

module.exports = router;
