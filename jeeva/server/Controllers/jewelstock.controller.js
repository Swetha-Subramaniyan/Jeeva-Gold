const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createJewelStock = async (req, res) => {
  try {
    const { jewelName, weight, stoneWeight, finalWeight, touch, purityValue } =
      req.body;

    const parsedWeight = parseFloat(weight);
    const parsedStoneWeight = parseFloat(stoneWeight || 0);
    const parsedFinalWeight = parseFloat(finalWeight);
    const parsedTouch = parseFloat(touch);
    const parsedPurityValue = parseFloat(purityValue);
    const normalizedJewelName = jewelName.toLowerCase();

    const existingEntry = await prisma.jewelStock.findFirst({
      where: {
        jewelName:normalizedJewelName,
        weight: parsedWeight,
        stoneWeight: parsedStoneWeight,
        touch: parsedTouch,
      },
    });

    let result;

    if (existingEntry) {
      result = await prisma.jewelStock.update({
        where: { id: existingEntry.id },
        data: {
          weight: existingEntry.weight + parsedWeight,
          stoneWeight: existingEntry.stoneWeight + parsedStoneWeight,
          finalWeight: existingEntry.finalWeight + parsedFinalWeight,
          purityValue: existingEntry.purityValue + parsedPurityValue,
        },
      });
    } else {
      result = await prisma.jewelStock.create({
        data: {
          jewelName,
          weight: parsedWeight,
          stoneWeight: parsedStoneWeight,
          finalWeight: parsedFinalWeight,
          touch: parsedTouch,
          purityValue: parsedPurityValue,
        },
      });
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating/updating jewel stock:", error);
    res.status(500).json({ error: "Failed to process jewel stock entry" });
  }
};

exports.getAllJewelStock = async (req, res) => {
  try {
    const entries = await prisma.jewelStock.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching jewel stock entries:", error);
    res.status(500).json({ error: "Failed to fetch jewel stock entries" });
  }
};

exports.updateJewelStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { jewelName, weight, stoneWeight, finalWeight, touch, purityValue } =
      req.body;

    const parsedWeight = parseFloat(weight);
    const parsedStoneWeight = parseFloat(stoneWeight || 0);
    const parsedFinalWeight = parseFloat(finalWeight);
    const parsedTouch = parseFloat(touch);
    const parsedPurityValue = parseFloat(purityValue);
    const parsedId = parseInt(id);
    const normalizedJewelName = jewelName.toLowerCase();

    const currentEntry = await prisma.jewelStock.findUnique({
      where: { id: parsedId },
    });

    if (!currentEntry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    const duplicateEntry = await prisma.jewelStock.findFirst({
      where: {
        id: { not: parsedId }, 
        jewelName: normalizedJewelName,
        weight: parsedWeight,
        stoneWeight: parsedStoneWeight,
        touch: parsedTouch,
      },
    });

    let result;

    if (duplicateEntry) {
      await prisma.jewelStock.delete({
        where: { id: parsedId },
      });

      result = await prisma.jewelStock.update({
        where: { id: duplicateEntry.id },
        data: {
          weight: duplicateEntry.weight + currentEntry.weight,
          stoneWeight: duplicateEntry.stoneWeight + currentEntry.stoneWeight,
          finalWeight: duplicateEntry.finalWeight + currentEntry.finalWeight,
          purityValue: duplicateEntry.purityValue + currentEntry.purityValue,
        },
      });
    } else {
      result = await prisma.jewelStock.update({
        where: { id: parsedId },
        data: {
          jewelName,
          weight: parsedWeight,
          stoneWeight: parsedStoneWeight,
          finalWeight: parsedFinalWeight,
          touch: parsedTouch,
          purityValue: parsedPurityValue,
        },
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating jewel stock:", error);
    res.status(500).json({ error: "Failed to update jewel stock entry" });
  }
};

exports.deleteJewelStock = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.jewelStock.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Jewel stock entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting jewel stock entry:", error);
    res.status(500).json({ error: "Failed to delete jewel stock entry" });
  }
};
