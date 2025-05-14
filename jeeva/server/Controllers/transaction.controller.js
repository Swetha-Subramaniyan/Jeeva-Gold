const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createTransaction = async (req, res) => {
  try {
    const { date, type, value, touch, purity, customerId } = req.body;
    console.log("Backend received request body:", req.body);

    if (!date || !type || !value || !customerId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        type,
        value: parseFloat(value),
        touch: touch ? parseFloat(touch) : null,
        purity: purity ? parseFloat(purity) : null,
        customer: {
          connect: {
            id: parseInt(customerId),
          },
        },
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    console.error("Prisma error details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllTransactions = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    const transactions = await prisma.transaction.findMany({
      where: { customerId: parseInt(customerId) },
      orderBy: { date: "desc" },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
};
