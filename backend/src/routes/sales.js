import express from "express";
import salesController from "../controllers/salesController.js";

const router = express.Router();

router.route("/").post(salesController.createSale)

router.route("/sales-category").get(salesController.getSalesByCategory)
router.route("/sales-date").get(salesController.getSalesByDate)
router.route("/sales-frequent").get(salesController.getFrequentCustomer)
router.route("/sales-best").get(salesController.getBestSellingProducts)
router.route("/sales-total").get(salesController.getTotalSales)

export default router;