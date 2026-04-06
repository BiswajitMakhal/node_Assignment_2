const Category = require("../models/category");

class CategoryController {
  async listCategories(req, res) {
    try {
      // Fetch main categories and aggregate their subcategories
      const categories = await Category.aggregate([
        { $match: { parentId: null } },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "parentId",
            as: "subcategories",
          },
        },
      ]);
      res.render("category/list", { categories });
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async addCategory(req, res) {
    try {
      await Category.create({ name: req.body.name, parentId: null });
      res.redirect("/categories");
    } catch (error) {
      res.status(500).send("Error");
    }
  }
    async editCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      res.render("category/edit", { category });
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async updateCategory(req, res) {
    try {
      await Category.findByIdAndUpdate(req.params.id, { name: req.body.name });
      res.redirect("/categories");
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async listSubcategories(req, res) {
    try {
      // Find all that have a parentId
      const subcategories = await Category.find({
        parentId: { $ne: null },
      }).populate("parentId");
      const mainCategories = await Category.find({ parentId: null }); // For the dropdown to add new
      res.render("subcategory/list", { subcategories, mainCategories });
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async addSubcategory(req, res) {
    try {
      await Category.create({
        name: req.body.name,
        parentId: req.body.parentId,
      });
      res.redirect("/subcategories");
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async deleteNode(req, res) {
    try {
      // This works for both. If it's a main category, you might want to delete its subcategories too
      await Category.deleteMany({ parentId: req.params.id }); // Delete child subcats first
      await Category.findByIdAndDelete(req.params.id); // Delete the node itself
      res.redirect("/categories");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error");
    }
  }
  async editSubcategory(req, res) {
    try {
      const subcategory = await Category.findById(req.params.id);
      const mainCategories = await Category.find({ parentId: null });
      res.render("subcategory/edit", { subcategory, mainCategories });
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async updateSubcategory(req, res) {
    try {
      await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        parentId: req.body.parentId,
      });
      res.redirect("/subcategories");
    } catch (error) {
      res.status(500).send("Error");
    }
  }

}

module.exports = new CategoryController();
