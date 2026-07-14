const errorhandler = (err, req, res, next) => {
    console.error(err.message);
    console.error(err.stack || "")
    const status = err.status || 500

    if(err instanceof multer.MulterEroor){
        res.status(400).json("Invalid file type or large file")
    }
    res.status(status).json({error: err.message})
}

module.exports = errorhandler