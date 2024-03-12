
exports.setCookie = (res, token) => {
  res.cookie(process.env.COOKIE_NAME, token, {
    expire: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 + Date.now(),
    // httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
  });
};

exports.getCookie = (req) => {
  return req.cookies[process.env.COOKIE_NAME];
};

exports.clearCookie = (res) => {
  res.clearCookie(process.env.COOKIE_NAME);
};