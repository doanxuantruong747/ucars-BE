const { sendResponse, AppError, catchAsync } = require("../helpers/untils")
const CarBrand = require("../models/CarBrand");

const carBrandController = {};

// add new a Car Brand
carBrandController.createNewCarBrand = catchAsync(async (req, res, next) => {

    let { name, image, status, description, model } = req.body

    let carBrand = await CarBrand.findOne({ name });
    if (carBrand)
        throw new AppError(400, "carBrand already exists", " Err Create carBrand")

    carBrand = await CarBrand.create({ name, image, status, description, model })

    sendResponse(
        res,
        200,
        true,
        carBrand,
        null,
        "Create carBrand successful")

})

// get list Car Brands
carBrandController.getCarBrands = catchAsync(async (req, res, next) => {

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

    const count = await CarBrand.countDocuments(filterCritera)

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1)

    let carBrands = await CarBrand.find(filterCritera)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)

    return sendResponse(res, 200, true, { carBrands, totalPages, count }, null, "Get carBands successful")

})

// get Single Car Brand
carBrandController.getSingleCarBrand = catchAsync(async (req, res, next) => {
    const CarBrandId = req.params.id;

    let carBrand = await CarBrand.findById(CarBrandId)

    if (!carBrand)
        throw new AppError(400, "CarBrand not found", "Get Single CarBrand Error")

    return sendResponse(res, 200, true, carBrand, null, "Get Single CarBrand successful")
});


// Update Single Car Brand
carBrandController.updateSingleCarBand = catchAsync(async (req, res, next) => {

    const carBandId = req.params.id;

    let carBrand = await CarBrand.findById(carBandId);
    if (!carBrand) throw new AppError(400, "Car Brand not found", "Update Car Brand Error")

    const allows = ["name", "image", "description", "status", "model"];

    allows.forEach((field) => {
        if (req.body[field] !== undefined) {
            carBrand[field] = req.body[field]
        }
    });
    await carBrand.save();

    return sendResponse(res, 200, true, carBrand, null, "Update Car Band successful")
});


// Delete Single Car Brand
carBrandController.deleteSingleCarBrand = catchAsync(async (req, res, next) => {

    const carBrandId = req.params.id;

    let carBrand = await CarBrand.findOneAndUpdate(
        { _id: carBrandId },
        { isDeleted: true },
        { new: true }
    )
    if (!carBrand) throw new AppError(400, "not found or Car Brand", "Deleta Car Brand Error")

    return sendResponse(res, 200, true, carBrand, null, "Delete Car Brand successful")
});


module.exports = carBrandController