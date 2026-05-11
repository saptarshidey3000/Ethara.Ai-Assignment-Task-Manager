/*
|--------------------------------------------------------------------------
| ROLE AUTHORIZATION MIDDLEWARE
|--------------------------------------------------------------------------
|
| Checks whether authenticated user
| has permission to access route.
|
*/

const authorizeRoles = (...roles) => {

  return (req, res, next) => {

    /*
    |--------------------------------------------------------------------------
    | Check User Role
    |--------------------------------------------------------------------------
    */

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        success: false,
        message: "Access denied"
      })

    }

    next()

  }

}

export default authorizeRoles