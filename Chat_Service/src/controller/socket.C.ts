import { ObjectId } from "mongodb";
import io from "../services/socketSetup";

class socketController {
    // Create Channel
    public static async registerSocket(userId: ObjectId, shipperId: ObjectId) {
        return true;
    }

    public static async storeMessage() {}
}

export default socketController;
