import { File, User } from "../models";

export default class FileService {
    public async uploadFile(location: string, id: number): Promise<void> {
        const user = await User.getRepository().findOne(id);
        File.createFile(location, user);
    }
}