const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carModelSchema = Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },


        isDeleted: { type: Boolean, default: false, select: false },
    },
    { timestamps: true }
);


const CarModel = mongoose.model("CarModel", carModelSchema);
module.exports = CarModel;