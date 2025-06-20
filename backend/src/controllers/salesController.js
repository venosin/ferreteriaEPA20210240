import salesModel from "../models/sales.js";

//array de funciones vacias
const salesController = {};

//====================
// VENTAS POR CATEGORIA
//====================

salesController.getSalesByCategory = async (req, res) => {
    try {
        const resultado = await salesModel.aggregate(
            [
                {
                    $group: {
                        _id: "$category",
                        totalSales: { $sum: "$total" }
                    },
                },
                //Ordenar los resultados
                {
                    $sort: { totalSales: -1 },
                },
            ]);
            res.status(200).json(resultado);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal server error" });
        }   
    };

    //Productos mas vendidos

    salesController.getBestSellingProducts = async (req, res) => {
        try {
            const resultado = await salesModel.aggregate(
                [
                    {
                        $group: {
                            _id: "$product",
                            cantidadVentas: { $sum: 1 }
                        },
                    },
                    //Ordenar los resultados
                    {
                        $sort: { cantidadVentas: -1 },
                    },
                    //Limitar la cantidad de datos a mostrar
                    { 
                        $limit: 5,
                    },
                ]);
                res.status(200).json(resultado);
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "internal server error" });
            }   
        };

        // ==============
        // CLIENTE CON MAS COMPRAS
        // ==============
        salesController.getFrequentCustomer = async (req, res) => {
            try {
                const resultado = await salesModel.aggregate(
                    [
                        {
                            $group: {
                                _id: "$customer",
                                cantidadVentas: { $sum: 1 }
                            },
                        },
                        //Ordenar los resultados
                        {
                            $sort: { cantidadVentas: -1 },
                        },
                        //Limitar la cantidad de datos a mostrar
                        { 
                            $limit: 3,
                        },
                    ]);
                    res.status(200).json(resultado);
                } catch (error) {
                    console.log(error);
                    res.status(500).json({ message: "internal server error" });
                }   
            };

            //GANANCIAS TOTALES
            salesController.getTotalSales = async (req, res) => {
                try {
                    const resultado = await salesModel.aggregate(
                        [
                            {
                                $group: {
                                    _id: null,
                                    totalSales: { $sum: "$total" }
                                },
                            },
                        ]);
                        res.status(200).json(resultado);
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({ message: "internal server error" });
                    }   
                };  