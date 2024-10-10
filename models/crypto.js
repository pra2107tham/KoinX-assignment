import mongoose, { Schema } from "mongoose";

const cryptoSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    marketCap: {
        type: Number,
        required: true,
    },
    change24h: {
        type: Number,
        required: true,
    }},
    {
        timestamps: true,
    }
);
const Crypto = mongoose.model("Crypto", cryptoSchema);
export default Crypto;
