const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const carBrandSchema = Schema(
    {
        name: { type: String, required: true },
        image: { type: String, },
        model: { type: String, },
        description: { type: String, },
        status: { type: String, enum: ["Active", "Inactive"] },

        isDeleted: { type: Boolean, default: false, required: true },
    },
    { timestamps: true }
);



const CarBrand = mongoose.model("CarBrand", carBrandSchema);
module.exports = CarBrand;