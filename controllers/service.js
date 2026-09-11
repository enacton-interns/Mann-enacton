import Service from "../models/Service.js";

export const handleAddService = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const service = await Service.create({ name, description, price, duration });
    return res.status(201).json({ success: true, service });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export const handleGetAllServices = async (req, res) => {
    try{
        const services = await Service.find();
        return res.status(200).json({ success: true, services });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const handleUpdateService = async (req, res) => {
    try{
        const { serviceId } = req.params;
        const { name, description, price, duration } = req.body;
        const updateFields = {};

        if (name) {
            updateFields.name = name;
        }
        if (description) {
            updateFields.description = description;
        }
        if (price) {
            updateFields.price = price;
        }
        if (duration) {
            updateFields.duration = duration;
        }
        
        const service = await Service.findByIdAndUpdate(serviceId, updateFields, { returnDocument: "after" });
        if(!service){
            return res.status(404).json({ success: false, error: "Service not found" });
        }
        return res.status(200).json({ success: true, service });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const handleDeleteService = async (req, res) => {
    try{
        const { serviceId } = req.params;
        const service = await Service.findByIdAndDelete(serviceId);
        if(!service){
            return res.status(404).json({ success: false, error: "Service not found" });
        }
        return res.status(200).json({ success: true, service });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};