const mathSuma = (req,res)=>{
    const {num1, num2} = req.params;
 
    const suma = Number(num1) + Number(num2);

    res.status(200).json({
        resultado : `El número ${num1} + ${num2} = ${suma}`
    })

};

const mathDivision = (req,res)=>{
    let num1 = Number(req.params.dividendo);
    let num2 = Number(req.params.divisor);

    if(num2 === 0){
        res.status(400).send('No se puede dividir por cero');
    }else{
        let resultado = num1 / num2;
        res.status(200).send(`El resultado es: ${resultado}`)
    }

};

const mathEsPar = (req,res)=>{
    const num = Number(req.params.num);

    if(isNaN(num)){
        res.status(400).send('El dato no es un número válido')
    }else{
        let  esPar = num % 2 === 0;

        res.send(`El número ${num} ${esPar ? 'es' : 'no es'} par.`)
    }
};


module.exports = {
    mathSuma,
    mathDivision,
    mathEsPar
}