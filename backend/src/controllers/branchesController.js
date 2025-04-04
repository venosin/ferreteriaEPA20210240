// Aquí en el controlador irán todos los métodos (CRUD)

const branchesController = {};
import branchesModel from "../models/Branches.js";

// SELECT
branchesController.getBranches = async (req, res) => {
    const branches = await branchesModel.find();
    res.json(branches);
};

// INSERT 
branchesController.createBranches = async (req, res) => {
    const { name, address, telephone, schedule } = req.body;
    const newBranch = new branchesModel({ name, address, telephone, schedule });
    await newBranch.save();
    res.json({ message: "Sucursal creada con éxito" });
};

// DELETE
branchesController.deleteBranches = async (req, res) => {
    await branchesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Sucursal eliminada" });
};

// UPDATE
branchesController.updateBranches = async (req, res) => {
    const { name, address, telephone, schedule } = req.body;
    await branchesModel.findByIdAndUpdate(
        req.params.id,
        { name, address, telephone, schedule },
        { new: true }
    );
    res.json({ message: "Sucursal actualizada" });
};

// SELECT BRANCH BY ID
branchesController.getBranch = async (req, res) => {
    const branch = await branchesModel.findById(req.params.id);
    res.json(branch);
};

export default branchesController;
