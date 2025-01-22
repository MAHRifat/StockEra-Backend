require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const authRoute = require("./Routes/AuthRoute");
const UserModel = require("./model/UserModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();




app.use(cors({
    origin: ['https://stockera-2bc33.web.app', 'https://stockera-dashboard.web.app'], // Allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed methods
    credentials: true, // Allow cookies and credentials
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cookie'], // Explicitly list allowed headers
}));

app.options('*', cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://stockera-2bc33.web.app");
    res.header("Access-Control-Allow-Origin", "https://stockera-dashboard.web.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    next();
});


app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());


app.use("/", authRoute);

app.get('/allUsers', async (req, res) => {
    let allUsers = await UserModel.find({});
    res.json(allUsers);
});


app.post('/verify-email', async (req, res) => {
    const { email, verificationCode } = req.body;

    console.log("Received email:", email);
    console.log("Received verification code:", verificationCode);

    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    console.log(user.verificationCode);

    if (user.verificationCode == verificationCode) {
        user.isVerified = true;
        user.verificationCode = null; // Clear the code after verification
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid verification code' });
    }
});


app.post("/api/verify-cookie", (req, res) => {
    const { token } = req.cookies;
    console.log("token: " + token);
    console.log("token key: " + process.env.TOKEN_KEY);
    if (!token) {
        return res.status(401).json({ status: false, message: "No token provided" });
    }

    try {
        const user = jwt.verify(token, process.env.TOKEN_KEY);
        console.log(user);
        res.json({ status: true, user }); // Send the decoded user info
    } catch (err) {
        res.status(401).json({ status: false, message: "Invalid token" });
    }
});





// app.get("/addHoldings", async(req, res)=>{
//     let tempHoldings = [
//         {
//           name: "BHARTIARTL",
//           qty: 2,
//           avg: 538.05,
//           price: 541.15,
//           net: "+0.58%",
//           day: "+2.99%",
//         },
//         {
//           name: "HDFCBANK",
//           qty: 2,
//           avg: 1383.4,
//           price: 1522.35,
//           net: "+10.04%",
//           day: "+0.11%",
//         },
//         {
//           name: "HINDUNILVR",
//           qty: 1,
//           avg: 2335.85,
//           price: 2417.4,
//           net: "+3.49%",
//           day: "+0.21%",
//         },
//         {
//           name: "INFY",
//           qty: 1,
//           avg: 1350.5,
//           price: 1555.45,
//           net: "+15.18%",
//           day: "-1.60%",
//           isLoss: true,
//         },
//         {
//           name: "ITC",
//           qty: 5,
//           avg: 202.0,
//           price: 207.9,
//           net: "+2.92%",
//           day: "+0.80%",
//         },
//         {
//           name: "KPITTECH",
//           qty: 5,
//           avg: 250.3,
//           price: 266.45,
//           net: "+6.45%",
//           day: "+3.54%",
//         },
//         {
//           name: "M&M",
//           qty: 2,
//           avg: 809.9,
//           price: 779.8,
//           net: "-3.72%",
//           day: "-0.01%",
//           isLoss: true,
//         },
//         {
//           name: "RELIANCE",
//           qty: 1,
//           avg: 2193.7,
//           price: 2112.4,
//           net: "-3.71%",
//           day: "+1.44%",
//         },
//         {
//           name: "SBIN",
//           qty: 4,
//           avg: 324.35,
//           price: 430.2,
//           net: "+32.63%",
//           day: "-0.34%",
//           isLoss: true,
//         },
//         {
//           name: "SGBMAY29",
//           qty: 2,
//           avg: 4727.0,
//           price: 4719.0,
//           net: "-0.17%",
//           day: "+0.15%",
//         },
//         {
//           name: "TATAPOWER",
//           qty: 5,
//           avg: 104.2,
//           price: 124.15,
//           net: "+19.15%",
//           day: "-0.24%",
//           isLoss: true,
//         },
//         {
//           name: "TCS",
//           qty: 1,
//           avg: 3041.7,
//           price: 3194.8,
//           net: "+5.03%",
//           day: "-0.25%",
//           isLoss: true,
//         },
//         {
//           name: "WIPRO",
//           qty: 4,
//           avg: 489.3,
//           price: 577.75,
//           net: "+18.08%",
//           day: "+0.32%",
//         },
//       ];

//       tempHoldings.forEach((item)=>{
//         let newHoldings = new HoldingsModel({
//             name: item.name,
//             qty: item.qty,
//             avg: item.avg,
//             price: item.price,
//             net: item.net,
//             day: item.day,
//         });

//         newHoldings.save();
//       });

//       res.send("done!");

// });

// app.get("/addPositions",async(req, res)=>{
//     const tempPostions = [
//         {
//           product: "CNC",
//           name: "EVEREADY",
//           qty: 2,
//           avg: 316.27,
//           price: 312.35,
//           net: "+0.58%",
//           day: "-1.24%",
//           isLoss: true,
//         },
//         {
//           product: "CNC",
//           name: "JUBLFOOD",
//           qty: 1,
//           avg: 3124.75,
//           price: 3082.65,
//           net: "+10.04%",
//           day: "-1.35%",
//           isLoss: true,
//         },
//       ];

//       tempPostions.forEach((item)=>{
//         let newPosition = new PositionsModel({
//                 product: item.product,
//                 name: item.name,
//                 qty: item.qty,
//                 avg: item.avg,
//                 price: item.price,
//                 net: item.net,
//                 day: item.day,
//                 isLoss: item.isLoss,
//             });

//         newPosition.save();

//     });
//     res.send("Done");
// });

app.get('/allHoldings', async (req, res) => {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
});

app.get('/allPositions', async (req, res) => {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
});

app.get("/allOrders", async (req, res) => {
    let allOrders = await OrdersModel.find({});
    res.json(allOrders);
});

app.post("/newOrder", async (req, res) => {
    console.log(req.body);
    let newOrder = new OrdersModel({
        name: req.body.name,
        qty: req.body.qty,
        price: req.body.price,
        mode: req.body.mode,
    });

    if (newOrder.qty <= 0) {
        return res.status(400).send("Order quantity must be greater than zero.");
    }
    else {
        await newOrder.save();
        res.send('Order saved');
    }
});

app.post("/updateOrder", async (req, res) => {
    console.log(req.body);

    const { name, qty, price } = req.body;

    try {
        // Use async/await to handle the update
        const updatedStock = await OrdersModel.findOneAndUpdate(
            { name: name },         // Filter
            { qty: qty, price: price }, // Update
            { new: true }           // Options: return the updated document
        );

        if (!updatedStock) {
            return res.status(404).send("Stock not found");
        }
        res.send(updatedStock);

    } catch (err) {
        console.error("Error updating stock:", err);
        res.status(500).send("Error updating stock");
    }
});



app.post("/sellStock", async (req, res) => {
    const { name, qty } = req.body;

    try {
        // Validate quantity
        if (qty <= 0) {
            return res.status(400).json({ message: "Invalid quantity. Quantity must be greater than 0" });
        }

        // Find the stock by name
        const stock = await OrdersModel.findOne({ name });

        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        if (stock.qty < qty) {
            return res.status(400).json({ message: "Insufficient stock quantity" });
        }

        // Calculate the updated quantity
        const updatedQty = stock.qty - qty;

        if (updatedQty === 0) {
            // Delete the stock if the quantity becomes 0
            await OrdersModel.deleteOne({ name });
        } else {
            // Update the stock's quantity
            stock.qty = updatedQty;
            await stock.save();
        }

        res.status(200).json({ message: "Stock sold successfully" });
    } catch (error) {
        console.error("Error processing sell stock request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.listen(PORT, () => {
    mongoose.connect(uri);
    console.log(`app started! ${PORT}`);
});


