const { Router }  = require('express');

const router = Router();

//Acá nos traemos los controladores de Math;
const {
    mathSuma,
    mathDivision,
    mathEsPar
} = require('../controllers/math')




router.get('/suma/:num1/:num2', mathSuma);

router.get('/division/:dividendo/:divisor', mathDivision);

router.get('/espar/:num', mathEsPar);

module.exports = router;