const User = require('../model/User');
const Group = require('../model/Group')
const ApiError = require('../util/ApiError');
const { mutipleMongooseToObject } = require('../util/mongoose');

class GroupController {
  async create(req, res, next){
    try {
        const {name, description} = req.body;
        const group = await Group.create({
            name, 
            description,
            createdBy: req.userId
        })
        res.status(201).json({
            success: true,
            data: group,
        });
    } catch (error) {
        return next(error)
    }
  }

  async get(req, res, next){
    try {
        const {id} = req.params;
        const group = await Group.findById(id);
        res.status(200).json({
            success: true,
            data: group
        })
    } catch (error) {
        return next(error)
    }
  }

  async getAll(req, res, next){
    try {
        const groups = await Group.find({
            createdBy: req.userId,
        }).populate({path: 'createdBy'})
        res.status(200).json({
            success: true,
            data: groups
        })
    } catch (error) {
        return next(error)
    }
  }

  async update(req, res, next){
    try {
        const {name, description} = req.body;
        const {id} = req.params;
        const group = await Group.findByIdAndUpdate(id, {
            name,
            description
        }, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            success: true,
            data: group
        })
    } catch (error) {
        return next(error)
    }
  }

  async delete(req, res, next){
    try {
        const {id} = req.params;
        const group = await Group.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Xóa  nhóm thành công"
        })
    } catch (error) {
        return next(error)
    }
  }
}

module.exports = new GroupController();
