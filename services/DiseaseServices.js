const asyncHandler = require('express-async-handler')
const DiseaseModel = require("../models/diseaseModel");
const ApiError = require("../utils/apiError");


// @desc    Get list of Diseases
// @route   GET /api/v1/diseases
// @access  Public
exports.getAllDiseases = asyncHandler( async(req,res)=>{
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 5;
    const skip = (page - 1) * limit;
    const diseases = await DiseaseModel.find({}).skip(skip).limit(limit);
    res.status(200).json({results: diseases.length, page, data: diseases});
});



// @desc    Get specific Disease by id
// @route   Get /api/v1/diseases/:id
// @access  Public
exports.getOneDisease = asyncHandler( async(req,res,next)=>{
    const disease =await DiseaseModel.findById(req.params.id);
    if(!disease){
        return next(new ApiError(`Not Found Any Disease For This Id ${id}`, 404));
    }
    res.status(200).json({data: disease});
});



// @desc    Create Disease
// @route   POST   /api/v1/diseases
// @access  Private
exports.createDisease =asyncHandler( async (req,res)=>{
    const disease = await DiseaseModel.create(req.body);
    res.status(201).json({data: disease});
});




// @desc    Update Specific Disease
// @route   PUT    /api/v1/diseases/:id
// @access  Private
exports.updateDisease = asyncHandler( async(req,res,next)=>{
    const disease = await DiseaseModel.findOneAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    if(!disease){
        return next(new ApiError(`Not Found Any Disease For This Id ${id}`, 404));
    }
    res.status(200).json({data: disease});
});



// @desc   Delete Specific Disease
// @route  DELETE  /api/v1/diseases/:id
// @access Private
exports.deleteDisease = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const disease = await DiseaseModel.findByIdAndDelete(id);

    if(!disease){
        return next(new ApiError(`Not Found Any Disease For This Id ${id}`, 404));
    }
    res.status(204).json({data: disease});
})
