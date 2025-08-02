import multer from "multer";
import crypto from "crypto";
import { extname, resolve } from "path";
import fs from "fs";

const tmpFolder = resolve(__dirname, "..", "..", "tmp", "uploads");
if (!fs.existsSync(tmpFolder)) {
    fs.mkdirSync(tmpFolder, { recursive: true });
}

console.log(`Temporary folder created at: ${tmpFolder}`);
export default {
    storage: multer.diskStorage({
        destination: tmpFolder,
        filename:
            (_, file, callback) => {
                console.log('File upload initiated:', file.originalname);
                crypto.randomBytes(16, (err, res) => {
                    if (err) return callback(err);

                    return callback(
                        null,
                        res.toString("hex") + extname(file.originalname),
                    );
                });
            },
    }),
};
