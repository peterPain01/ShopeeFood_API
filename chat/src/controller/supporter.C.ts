import { ObjectId } from "mongodb";
import Supporter from "../models/supporter.model";

export default class SupporterController {
    async regisSupporter(supporterId: ObjectId) {
        return await Supporter.create({ id: supporterId });
    }

    async unRegisSupporter(supportId: ObjectId) {
        return await Supporter.deleteOne({ id: supportId });
    }
}
