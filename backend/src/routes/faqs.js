import express from "express";
import faqsController from "../controllers/faqController.js";

const router = express.Router();

router.route("/")
.get(faqsController.getAllfaqs)
.post(faqsController.createFaq);

router.route("/:id")
.get(faqsController.getFaqById)
.put(faqsController.updateFaq)
.delete(faqsController.deleteFaq);

export default router;
