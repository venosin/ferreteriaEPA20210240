import faqsModel from "../models/Faqs.js";

//Creo un array de funciones vacio
const faqsController = {};

//SELECT 
faqsController.getAllfaqs = async (req, res) => {

    try{
        const faqs = await faqsModel.find();
        res.status(200).json(faqs);
    }catch(error){
        res.status(500).json({message: "Error al obtener las preguntas frecuentes", error});
    }
}

//INSERT
faqsController.createFaq = async (req, res) => {
   //1- pedir las cosas
   const {question, answer, level, isActive} = req.body;
   
   try {

    //Validar 
    //Validar si no hay campos vacios
    if(!question || !answer || !level || !isActive === undefined){
        return res.status(400).json({message: "Todos los campos son obligatorios"});
    }

    if(level < 1 || level > 10){
        return res.status(400).json({message: "El nivel debe estar entre 1 y 10"});
    }

    if(isActive !== true && isActive !== false){
        return res.status(400).json({message: "El campo isActive debe ser true o false"});
    }
     
    if(question.length < 4 || answer.length < 4){
        return res.status(400).json({message: "El campo question y answer deben tener al menos 4 caracteres"});
    }

    //Guardamos en la base de datos
    const newFaqs = new faqsModel({
        question,
        answer,
        level,
        isActive
    });

    newFaqs.save();
    res.status(200).json({message: "Pregunta frecuente creada exitosamente", newFaqs});

} catch (error) {
    console.log("error "+error);
    res.status(500).json({message: "Error al crear la pregunta frecuente", error});
}
};

//ACTUALIZAR
faqsController.updateFaq = async (req, res) => {
    //1- pedir las cosas
    const {question, answer, level, isActive} = req.body;
    try {
        //Validar 
        if (level < 1 || level > 10) {
            return res
            .status(400)
            .json({message: "El nivel debe estar entre 1 y 10"});
        }

        if(question.length < 4 || answer.length < 4){
            return res.status(400).json({message: "El campo question y answer deben tener al menos 4 caracteres"});
        }
        const updatedFaq = await faqsModel.findByIdAndUpdate(
            req.params.id,
            {question, answer, level, isActive},
            {new: true}
        );

        if(!updatedFaq){
            return res.status(400).json({message: "Pregunta frecuente no encontrada"});
        }

        res.status(200).json({message: "Pregunta frecuente actualizada exitosamente", updatedFaq});
    } catch (error) {
        console.log("error "+error);
        res.status(500).json({message: "Error al actualizar la pregunta frecuente", error});
    }
}
    
//ELIMINAR
faqsController.deleteFaq = async (req, res) => {
    try {
        const deletedFaq = await faqsModel.findByIdAndDelete(req.params.id);
        
        if (!deletedFaq) {
            return res.status(404).json({message: "Pregunta frecuente no encontrada"});
        }
        res.status(200).json({message: "Pregunta frecuente eliminada exitosamente"});

    } catch (error) {
        console.log("error "+error);
        res.status(500).json({message: "Error al eliminar la pregunta frecuente", error});
    }
};

//SELECT POR ID
faqsController.getFaqById = async (req, res) => {
    try {
        const faq = await faqsModel.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({message: "Pregunta frecuente no encontrada"});
        }
        res.status(200).json(faq);
    } catch (error) {
        console.log("error "+error);
        res.status(500).json({message: "Error al obtener la pregunta frecuente", error});
    }
};

export default faqsController;
    

