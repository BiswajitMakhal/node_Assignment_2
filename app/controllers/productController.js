const Product = require("../models/product");
const Category = require("../models/category");

class ProductController {
  async listProducts(req, res) {
    try {
      const products = await Product.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "catData",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "subcategory",
            foreignField: "_id",
            as: "subCatData",
          },
        },
        { $unwind: "$catData" },
        { $unwind: "$subCatData" },
        {
          $project: {
            name: 1,
            price: 1,
            categoryName: "$catData.name",
            subcategoryName: "$subCatData.name",
          },
        },
      ]);

      const mainCategories = await Category.find({ parentId: null });
      const subCategories = await Category.find({ parentId: { $ne: null } });

      res.render("product/list", { products, mainCategories, subCategories });
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async addProduct(req, res) {
    try {
      const { name, price, category, subcategory } = req.body;
      await Product.create({ name, price, category, subcategory });
      res.redirect("/products");
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async deleteProduct(req, res) {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.redirect("/products");
    } catch (error) {
      res.status(500).send("Error");
    }
  }
}

module.exports = new ProductController();
