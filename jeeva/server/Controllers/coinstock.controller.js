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
        stockLogs: {
          create: {
            coinType,
            gram: parseFloat(gram),
            quantity: parseInt(quantity),
            changeType: "ADD",
            reason: "Initial stock added",
          },
        },
      },
      include: { stockLogs: true },
    });

    res
      .status(201)
      .json({ message: "Stock item added successfully", data: newStock });
  } catch (error) {
    console.error("error", error);
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

const reduceStock = async (req, res) => {
  try {
    const { coinType, gram, quantity, reason } = req.body;
    console.log("Received reduce request:", {
      coinType,
      gram,
      quantity,
      reason,
    });

    const stock = await prisma.coinStock.findFirst({
      where: {
        coinType,
        gram: parseFloat(gram),
      },
    });

    console.log("Found stock:", stock);

    if (!stock) {
      console.log("Stock item not found");
      return res.status(404).json({ message: "Stock item not found" });
    }

    if (stock.quantity < parseInt(quantity)) {
      console.log(
        `Insufficient stock. Requested: ${quantity}, Available: ${stock.quantity}`
      );
      return res.status(400).json({
        message: `Insufficient stock. Available: ${stock.quantity}`,
      });
    }

    const updatedStock = await prisma.coinStock.update({
      where: { id: stock.id },
      data: {
        quantity: stock.quantity - parseInt(quantity),
        stockLogs: {
          create: {
            coinType,
            gram: parseFloat(gram),
            quantity: -parseInt(quantity),
            changeType: "REMOVE",
            reason: reason || "Billed",
          },
        },
      },
      include: { stockLogs: true },
    });

    console.log("Stock reduced successfully:", updatedStock);
    res.status(200).json({
      message: "Stock reduced successfully",
      data: updatedStock,
    });
  } catch (error) {
    console.error("Error in reduceStock:", error);
    res
      .status(500)
      .json({ message: "Error reducing stock", error: error.message });
  }
};

const getAllLogs = async (req, res) => {
  try {
    const logs = await prisma.stockLog.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock logs", error });
  }
};

module.exports = {
  createStock,
  getAllStocks,
  updateStock,
  deleteStock,
  reduceStock,
  getAllLogs,
};
