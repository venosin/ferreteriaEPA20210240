// Aqui en el controlador iran todos los metodos 

// Aquí en el controlador irán todos los métodos (CRUD)

const employeesController = {};
import { request } from "express";
import employeesModel from "../models/Employees.js";

// SELECT
employeesController.getEmployees = async (req, res) => {
    const employees = await employeesModel.find();
    res.json(employees);
};

// INSERT 
employeesController.createEmployee = async (req, res) => {
    const { name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified } = req.body;
    const newEmployee = new employeesModel({ name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified });
    await newEmployee.save();
    res.json({ message: "Empleado creado con éxito" });
};

// DELETE
employeesController.deleteEmployee = async (req, res) => {
    await employeesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Empleado eliminado" });
};

// UPDATE
employeesController.updateEmployee = async (req, res) => {
    const { name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified } = req.body;
    await employeesModel.findByIdAndUpdate(
        req.params.id,
        { name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified },
        { new: true }
    );
    res.json({ message: "Empleado actualizado" });
};

// SELECT EMPLOYEE BY ID
employeesController.getEmployee = async (req, res) => {
    const employee = await employeesModel.findById(req.params.id);
    res.json(employee);
};

export default employeesController;



// export const getEmployees = async (req, res) => {
//     try {
//         const employees = await Employee.find();
//         res.status(200).json(employees);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching employees", error });
//     }
// };

// export const getEmployeeById = async (req, res) => {
//     try {
//         const employee = await Employee.findById(req.params.id);
//         if (!employee) return res.status(404).json({ message: "Employee not found" });
//         res.status(200).json(employee);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching employee", error });
//     }
// };

// export const createEmployee = async (req, res) => {
//     try {
//         const newEmployee = new Employee(req.body);
//         await newEmployee.save();
//         res.status(201).json(newEmployee);
//     } catch (error) {
//         res.status(500).json({ message: "Error creating employee", error });
//     }
// };

// export const updateEmployee = async (req, res) => {
//     try {
//         const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });
//         res.status(200).json(updatedEmployee);
//     } catch (error) {
//         res.status(500).json({ message: "Error updating employee", error });
//     }
// };

// export const deleteEmployee = async (req, res) => {
//     try {
//         const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
//         if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });
//         res.status(200).json({ message: "Employee deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting employee", error });
//     }
// };
