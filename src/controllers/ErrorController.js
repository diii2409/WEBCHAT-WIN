class ErrorController{
  handle (err, req, res, next) {
    res.json({
      status: err.status,
      message: err.message,
    });
  };
}

module.exports = new ErrorController();