const express = require("express");
const router = express.Router();
const Joi = require("joi").extend(require("@joi/date"));
const auth = require("../middlewares/authorize");

router.get("/", auth, async (req, res) => {
  try {
    const products = await db.query("SELECT * FROM products;");
    res.send(products[0]);
  } catch (err) {
    res.status(500).send("Something goes wrong.");
  }
});

router.post("/", auth, async (req, res) => {
  // validate req.body
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let product = {
    name: req.body.name,
    price: parseFloat(req.body.price),
    creationDate: req.body.creationDate,
  };

  try {
    await db.query("INSERT INTO products VALUES (DEFAULT, ?, ?, ?)", [
      product.name,
      product.price,
      product.creationDate,
    ]);
  } catch (err) {
    res.status(500).send("Something goes wrong.");
  }
  product = await db.query(
    "SELECT * FROM products WHERE product_id = last_insert_id();"
  );
  res.send(product[0][0]);
});

router.delete("/:id", auth, async (req, res) => {
  // check existence
  const product = await db.query(
    "SELECT * FROM products WHERE product_id = ?;",
    [parseInt(req.params.id)]
  );
  if (!product[0][0])
    return res.status(404).send("Product with the given id was not found.");

  //delete
  try {
    await db.query("DELETE FROM products WHERE product_id = ?", [
      parseInt(req.params.id),
    ]);
  } catch (err) {
    res.status(500).send("Something goes wrong.");
  }

  //return deleted product to client
  res.send(product[0][0]);
});

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    creationDate: Joi.date().format("YYYY-MM-DD").utc(),
  });
  return schema.validate(product);
}

module.exports = router;
