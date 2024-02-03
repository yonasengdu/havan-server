import mongoose, {Document,Model,Schema} from "mongoose";


export interface IOrder extends Document{
    courseId: string;
    userId?:string;
    access: String;
}

const orderSchema = new Schema<IOrder>({
    courseId: {
     type: String,
     required: true
    },
    userId:{
        type: String,
        required: true
    },
    access:{
        type: String,
        default :"Denied"
    },
},{timestamps: true});

const OrderModel: Model<IOrder> = mongoose.model('Order',orderSchema);

export default OrderModel;