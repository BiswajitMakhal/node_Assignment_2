const mongoose = require("mongoose");

// If parentId is null, it's a Main Category. If parentId has an ObjectId, it's a Subcategory.
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
