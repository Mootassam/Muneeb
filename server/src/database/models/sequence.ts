import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model("sequence");
  } catch (error) {
    // continue, because model doesnt exist
  }

  const SequenceItemSchema = new Schema(
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      itemNumber: {
        type: Number,
        required: true,
      },
    },
    { _id: false }
  );

  const SequenceSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      products: [SequenceItemSchema],
      combos: [SequenceItemSchema],

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

  SequenceSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: "string" },
      },
    }
  );

  SequenceSchema.virtual("id").get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  SequenceSchema.set("toJSON", {
    getters: true,
  });

  SequenceSchema.set("toObject", {
    getters: true,
  });

  return database.model("sequence", SequenceSchema);
};
