import mongoose, { Schema } from "mongoose";

const cryptoLatestSchema = new Schema({
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
    }
},
{
    timestamps: true,
});

const CryptoLatest = mongoose.model("CryptoLatest", cryptoLatestSchema);
export default CryptoLatest;
