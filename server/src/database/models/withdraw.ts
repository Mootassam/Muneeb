import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model("withdraw");
  } catch (error) {
    // continue, because model doesnt exist
  }

  const WithdrawSchema = new Schema(
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
        default: "USDT",
      },
      protocol: {
        type: String,
        default: "TRC-20",
      },
      address: {
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

  WithdrawSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: "string" },
      },
    }
  );

  WithdrawSchema.virtual("id").get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  WithdrawSchema.set("toJSON", {
    getters: true,
  });

  WithdrawSchema.set("toObject", {
    getters: true,
  });

  return database.model("withdraw", WithdrawSchema);
};
