export default interface CustomMulterFile extends Express.Multer.File {
    location?: string;
}