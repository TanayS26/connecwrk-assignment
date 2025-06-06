const { error } = require("../helper/baseResponse");

const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(401)
        .json(error("Not authorized, user role not found", 401));
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(
          error(
            `Forbidden: User with role '${req.user.role}' is not allowed to access this resource`,
            403
          )
        );
    }
    next();
  };
};

module.exports = authorizeRoles;
