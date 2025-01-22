const {Schema} = require("mongoose");


const OrdersSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    qty: {
        type: Number,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    mode: {
        type: String,
        require: true,
    },
});

module.exports = {OrdersSchema};