// Aqui en el controlador iran todos los metodos 
// ( CRUD ) 

const reviewsController = {};
import reviewsModel from "../models/reviews.js";

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
    const { comment, rating, idClient } = req.body;
    const updateReview = await reviewsModel.findByIdAndUpdate(
        req.params.id,
        { comment, rating, idClient },
        { new: true }
    );

    res.json({ message: "Reseña actualizada" });
};

// SELECT REVIEW BY ID
reviewsController.getReview = async (req, res) => {
    const review = await reviewsModel.findById(req.params.id).populate('idClient');
    res.json(review);
};

export default reviewsController;