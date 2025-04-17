const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createStock = async (req, res) => {
  try {
    const { coinType, gram, quantity, touch, totalWeight, purity } = req.body;

    const newStock = await prisma.coinStock.create({
      data: {
        coinType,
        gram: parseFloat(gram),
        quantity: parseInt(quantity),
        touch: parseFloat(touch),
        totalWeight: parseFloat(totalWeight),
        purity: parseFloat(purity),
      },
    });

    res
      .status(201)
      .json({ message: "Stock item added successfully", data: newStock });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error adding stock item", error });
  }
};

const getAllStocks = async (req, res) => {
  try {
    const stocks = await prisma.coinStock.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stocks", error });
  }
};
const deleteStock = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStock = await prisma.coinStock.delete({
      where: { id: parseInt(id) },
    });

    res
      .status(200)
      .json({ message: "Stock item deleted successfully", data: deletedStock });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stock item", error });
  }
};

const updateStock = async (req, res) => {
  const { id } = req.params;
  const { coinType, gram, quantity, touch, totalWeight, purity } = req.body;

  try {
    const updatedStock = await prisma.coinStock.update({
      where: { id: parseInt(id) },
      data: {
        coinType,
        gram: parseFloat(gram),
        quantity: parseInt(quantity),
        touch: parseFloat(touch),
        totalWeight: parseFloat(totalWeight),
        purity: parseFloat(purity),
      },
    });

    res
      .status(200)
      .json({ message: "Stock item updated successfully", data: updatedStock });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock item", error });
  }
};

module.exports = {
  createStock,
  getAllStocks,
  updateStock,
  deleteStock,
};
