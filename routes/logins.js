const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  //first, validate user input
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    //try to get user with the given email and password
    user = await db.query(
      "SELECT * FROM users WHERE email = ? AND password = ?;",
      [user.email, user.password]
    );
    user = user[0][0];

    if (!user)
      return res.status(500).send("User not found with these credentials.");

    //the user exists, so send him a token with this encoded payload
    const payload = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.get("jwtPrivateKey"));
    res.send(token);
  } catch (err) {
    res.status(500).send("Something goes wrong.");
  }
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
}
module.exports = router;
