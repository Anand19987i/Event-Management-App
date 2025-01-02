import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("avatar");
export const Uploads = multer({storage}).fields([
    {name: "eventThumbnail", maxCount: 1},
    {name : "eventPoster", maxCount: 1},
])