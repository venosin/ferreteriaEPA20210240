// Aqui en el controlador iran todos los metodos 
// ( CRUD ) 

const reviewsController = {};
import reviewsModel from "../models/Reviews.js";

// SELECT
reviewsController.getReviews = async (req, res) => {
    const reviews = await reviewsModel.find().populate('idClient');
    res.json(reviews);
};

// INSERT 
reviewsController.createReview = async (req, res) => {
    const { comment, rating, idClient } = req.body;
    const newReview = new reviewsModel({ comment, rating, idClient });
    await newReview.save();
    res.json({ message: "Reseña creada con éxito" });
};

// DELETE
reviewsController.deleteReview = async (req, res) => {
    const deleteReview = await reviewsModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Reseña eliminada" });
};

// UPDATE
reviewsController.updateReview = async (req, res) => {
    try {
        // Validar si el ID es válido
        if (!req.params.id) {
            return res.status(400).json({ message: "ID de reseña no proporcionado" });
        }

        const { comment, rating, idClient } = req.body;
        
        // Validar los campos obligatorios
        if (!comment || rating === undefined) {
            return res.status(400).json({ message: "Comentario y calificación son obligatorios" });
        }

        // Validar que el rating sea un número entre 1 y 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "La calificación debe estar entre 1 y 5" });
        }

        // Actualizar la reseña
        const updatedReview = await reviewsModel.findByIdAndUpdate(
            req.params.id,
            { comment, rating, idClient },
            { new: true }
        );

        // Verificar si la reseña existe
        if (!updatedReview) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }

        // Retornar la reseña actualizada
        res.status(200).json({
            message: "Reseña actualizada con éxito",
            review: updatedReview
        });
    } catch (error) {
        console.error("Error al actualizar la reseña:", error);
        res.status(500).json({ message: "Error al actualizar la reseña", error: error.message });
    }
};

// SELECT REVIEW BY ID
reviewsController.getReview = async (req, res) => {
    const review = await reviewsModel.findById(req.params.id).populate('idClient');
    res.json(review);
};

export default reviewsController;