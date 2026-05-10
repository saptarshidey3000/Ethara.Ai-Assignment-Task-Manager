import bcrypt from "bcrypt"

/*
|--------------------------------------------------------------------------
| COMPARE PASSWORD
|--------------------------------------------------------------------------
|
| Verifies plain password against hashed password.
|
*/

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

export default comparePassword