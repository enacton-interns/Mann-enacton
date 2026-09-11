import mongoose from "mongoose";

const ServiceProviderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        }
      },
    ],
    availability: {
      type: Boolean,
      default : true
    },
  },
  { timestamps: true },
);

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  ServiceProviderSchema,
);

export default ServiceProvider;
