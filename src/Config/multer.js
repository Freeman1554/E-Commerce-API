const multer = require("multer");

const uploaded = multer({
    dest: "uploads/",
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')){
        cb(null, true);
    } else {
        cb(new Error('image only'), false)
    }
    }
});


const uploads = async (req, res, next) => {
    //uploaded.single("image")(req, res, (err) => {
    uploaded.array("image", 2)(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                error: err.message
            });
        }

        if (!req.files) {
            return res.status(400).json({
                error: "No file uploaded"
            });
        }

        console.log("Uploaded file:", req.files);
        console.log("Request body:", req.body);

        res.status(200).json({
            message: "File uploaded successfully",
            file: req.files
        });
    });
};

//const path = require("path");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/uploads");
//     },

//     filename: (req, file, cb) => {
//         const uniqueName =
//             Date.now() +
//             "-" +
//             Math.round(Math.random() * 1E9);

//         cb(
//             null,
//             uniqueName + path.extname(file.originalname)
//         );
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpg|jpeg|png|gif|webp/;

//     const extName = allowedTypes.test(
//         path.extname(file.originalname).toLowerCase()
//     );

//     const mimeType = allowedTypes.test(
//         file.mimetype
//     );

//     if (extName && mimeType) {
//         return cb(null, true);
//     }

//     cb(new Error("Only image files are allowed"));
// };

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//         fileSize: 5 * 1024 * 1024
//     }
// });

module.exports = uploads;