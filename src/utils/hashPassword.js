import bcrypt from "bcrypt"

/*
|--------------------------------------------------------------------------
| HASH PASSWORD
|--------------------------------------------------------------------------
|
| Converts plain password into secure hashed password
| before storing inside database.
|
*/

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

export default hashPassword