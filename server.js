const express = require("express");
const fs = require("fs");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Get products
app.get("/products", (req, res) => {
  let data = fs.readFileSync("products.json");
  res.json(JSON.parse(data));
});

// Add product
app.post("/add-product", upload.single("image"), (req, res) => {
  let products = JSON.parse(fs.readFileSync("products.json"));

  let newProduct = {
  id: Date.now(),
  name: req.body.name,
  category: req.body.category,
  price: req.body.price,
  discount: req.body.discount,
  image: "/uploads/" + req.file.filename
};

  products.push(newProduct);

  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

  res.send("Product Added");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
app.use("/admin.html", (req, res, next) => {
  const auth = { user: "admin", pass: "123456" };

  const b64 = (req.headers.authorization || "").split(" ")[1] || "";
  const [user, pass] = Buffer.from(b64, "base64").toString().split(":");

  if (user === auth.user && pass === auth.pass) {
    next();
  } else {
    res.set("WWW-Authenticate", "Basic realm='Admin Panel'");
    res.status(401).send("Login Required");
  }
});