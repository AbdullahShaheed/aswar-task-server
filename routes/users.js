const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();

//register a new user
router.post("/", async (req, res) => {
  let user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  };
  //validate req.body
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    //check if email already used
    const result = await db.query("SELECT * FROM users WHERE email = ?", [
      user.email,
    ]);
    if (result[0].length !== 0)
      return res.status(400).send("User already registered.");

    //now try to insert
    await db.query("INSERT INTO users VALUES (DEFAULT, ?, ?, ?, ?);", [
      user.name,
      user.email,
      user.password,
      user.role,
    ]);
  } catch (err) {
    res.status(500).send("Something goes wrong.");
  }
  user = await db.query(
    "SELECT * FROM users WHERE user_id = last_insert_id();"
  );

  //send newly added user back to client without the password including jwt in the header
  user = user[0][0]; //query result is complex object, [0][0] gives the wanted user object

  const payload = {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, config.get("jwtPrivateKey"));
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(payload);
});

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(), //'admin' or 'common'
  });
  return schema.validate(user);
}

module.exports = router;
