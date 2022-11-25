const { sendResponse, AppError, catchAsync } = require("../helpers/untils")
const CarModel = require("../models/CarModel");


const carModelController = {};

// Create Car Model
carModelController.createCarModel = catchAsync(async (req, res, next) => {

    let { name, image, price } = req.body

    let carModel = await CarModel.findOne({ name });

    if (carModel)
        throw new AppError(400, "Car Model already exists", "Create Err")

    carModel = await CarModel.create({ name, image, price })

    sendResponse(
        res,
        200,
        true,
        carModel,
        null,
        "Create Car Model successful")
})


// get list Car Model
carModelController.getCarModel = catchAsync(async (req, res, next) => {

    let { page, limit, name, ...filterQuery } = req.query

    const filterKeys = Object.keys(filterQuery);
    if (filterKeys.length)
        throw new AppError(400, "Not accepted query", "Bad Request");

    const filterConditions = [{ isDeleted: false }]
    if (name) {
        filterConditions.push({
            name: { $regex: name, $options: "i" },
        })
    }
    const filterCritera = filterConditions.length
        ? { $and: filterConditions }
        : {};

    const count = await CarModel.countDocuments(filterCritera)

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1)

    let carModels = await CarModel.find(filterCritera)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)

    return sendResponse(res, 200, true, { carModels, totalPages, count }, null, "Get carBands successful")

})

// get Single Car Model
carModelController.getSingleCarModel = catchAsync(async (req, res, next) => {
    const CarModelId = req.params.id;

    let carModel = await CarModel.findById(CarModelId).populate("authorCarBrand");

    if (!carModel)
        throw new AppError(400, "Car Model not found", "Get Single Car Model Error")

    return sendResponse(res, 200, true, carModel, null, "Get Single Car Model successful")
});


// Update Single Car Model
carModelController.updateSingleCarModel = catchAsync(async (req, res, next) => {

    const carModelId = req.params.id;

    let carModel = await CarModel.findById(carModelId);

    if (!carModel) throw new AppError(400, "Car Model not found", "Update Car Model Error")

    const allows = ["name", "image", "price"];

    allows.forEach((field) => {
        if (req.body[field] !== undefined) {
            carModel[field] = req.body[field]
        }
    });
    await carModel.save();

    return sendResponse(res, 200, true, carModel, null, "Update Car Model successful")
});


// Delete Single Car Model
carModelController.deleteSingleCarModel = catchAsync(async (req, res, next) => {

    const carModelId = req.params.id;

    let carModel = await CarModel.findOneAndUpdate(
        { _id: carModelId },
        { isDeleted: true },
        { new: true }
    )
    if (!carModel) throw new AppError(400, "not found or Car Model", "Deleta Car Model Error")

    return sendResponse(res, 200, true, carModel, null, "Delete Car Model successful")
});





module.exports = carModelController