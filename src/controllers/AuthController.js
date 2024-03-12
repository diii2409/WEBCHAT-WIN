const User = require('../model/User');
const {setCookie, getCookie, clearCookie} = require('../util/cookie')
const ApiError = require('../util/ApiError');
const { mutipleMongooseToObject } = require('../util/mongoose');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, fullname, gender, description } = req.body;
      const user = await User.create({
        email,
        password,
        fullname,
        gender,
        description,
      });
      user.password = undefined;
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next){
    try {
      const {email, password} = req.body;
      if(!email || !password){
        return next(new ApiError(400, "Vui lòng cung cấp đầy đủ thông tin đăng nhập"))
      }
      
      const user = await User.findOne({
        email,
      })
      console.log(user)
      if(!user || !(await user.comparePassword(password, user.password))){
        return next(new ApiError(400, "Thông tin đăng nhập không hợp lệ"))
      }
      setCookie(res, user._id)
      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công"
      })
    } catch (error) {
      return next(error)
    }
  }

  authorize(req, res, next){ 
      const id = getCookie(req);
      req.userId = id;
      if(!id){
        return next(new ApiError(403, "Không có quyền truy cập"))
      }
      next()
  }
}

module.exports = new AuthController();
