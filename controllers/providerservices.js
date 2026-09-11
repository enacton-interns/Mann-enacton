import ServiceProvider from "../models/ServiceProvider.js";
import Service from "../models/Service.js";

export const handleAddService = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user.id;

    // Business logic: prevent duplicate service for same provider
    const serviceExistsforUser = await ServiceProvider.findOne({
      userId,
      "services.serviceId": serviceId,
    });

    if (serviceExistsforUser) {
      return res.status(400).json({
        success: false,
        error: "Service already exists for this user",
      });
    }

    const serviceDetails = {
      serviceId: serviceId,
    };

    const serviceProvider = await ServiceProvider.findOneAndUpdate(
      { userId },
      { $push: { services: serviceDetails } },
      { upsert: true, new: true },
    );

    return res.status(201).json({ success: true, serviceProvider });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleGetServices = async (req, res) => {
  try {
    const userId = req.user.id;
    const serviceProvider = await ServiceProvider.findOne({ userId })
      .populate("services.serviceId", "name price duration")
      .populate("userId", "name");

    if (!serviceProvider) {
      return res
        .status(404)
        .json({ success: false, error: "Provider not found" });
    }

    return res.status(200).json({ success: true, serviceProvider });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleDeleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user.id;

    const updatedServiceProvider = await ServiceProvider.findOneAndUpdate(
      {
        userId,
        "services.serviceId": serviceId,
      },
      {
        $pull: { services: { serviceId } },
      },
      {
        returnDocument: "after",
      },
    ).populate("services.serviceId", "name");

    if (!updatedServiceProvider) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedServiceProvider,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleUpdateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const userId = req.user.id;

    // Business logic: availability must be boolean — validated by Zod

    const updatedServiceProvider = await ServiceProvider.findOneAndUpdate(
      { userId },
      { $set: { availability } },
      { returnDocument: "after" },
    );

    if (!updatedServiceProvider) {
      return res.status(404).json({
        success: false,
        error: "Service not found for the user",
      });
    }

    return res.status(200).json({
      success: true,
      updatedServiceProvider,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleGetServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }
    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
