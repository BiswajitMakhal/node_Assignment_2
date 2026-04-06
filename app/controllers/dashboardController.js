const Product = require('../models/product');
const Category = require('../models/category');

class DashboardController {
    async getDashboard(req, res) {
        try {
            const totalCategories = await Category.countDocuments({ parentId: null });
            const totalSubcategories = await Category.countDocuments({ parentId: { $ne: null } });
            const totalProducts = await Product.countDocuments();

            // Aggregation pipeline: Total products under each specific category
            const productsByCategory = await Product.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "categoryDetails" } },
                { $unwind: "$categoryDetails" },
                { $project: { categoryName: "$categoryDetails.name", count: 1 } }
            ]);

            // Aggregation pipeline: Total products under each specific subcategory
            const productsBySubcategory = await Product.aggregate([
                { $group: { _id: "$subcategory", count: { $sum: 1 } } },
                { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "subCategoryDetails" } },
                { $unwind: "$subCategoryDetails" },
                { $project: { subCategoryName: "$subCategoryDetails.name", count: 1 } }
            ]);

            res.render('dashboard', {
                totalCategories,
                totalSubcategories,
                totalProducts,
                productsByCategory,
                productsBySubcategory
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Dashboard Error");
        }
    }
}

module.exports = new DashboardController();