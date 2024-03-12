const errorController = require('../controllers/ErrorController');
const groupRouter = require('./group')
const authRouter = require('./auth');

function route(app) {
  app.get('/', (req, res, next) => {
    res.status(200).json({
      success: true,
      message: 'Thành công',
    });
  });
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/group', groupRouter);

  app.use(errorController.handle);
  app.use('*', (req, res, next) => {
    res.status(404).json({
      success: false,
      message: 'Đường dẫn không hợp lệ',
    });
  });
}

module.exports = route;
