import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model("deposit");
  } catch (error) {
    // continue, because model doesnt exist
  }

  const DepositSchema = new Schema(
    {
      status: {
        type: String,
        enum: ["pending", "canceled", "success"],
        default: "pending",
      },
      amount: {
        type: String,
      },
      currency: {
        type: String,
      },
      paymentMethod: {
        type: String,
      },
      protocol: {
        type: String,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      tenant: {
        type: Schema.Types.ObjectId,
        ref: "tenant",
        required: true,
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      importHash: { type: String },
    },
    { timestamps: true }
  );

  DepositSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: "string" },
      },
    }
  );

  DepositSchema.virtual("id").get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  DepositSchema.set("toJSON", {
    getters: true,
  });

  DepositSchema.set("toObject", {
    getters: true,
  });

  return database.model("deposit", DepositSchema);
};
