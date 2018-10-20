const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: __dirname + '../../tmp/' })

module.exports = {
    schema: {},
    
    endpoint: '/tiles/image',
    method: 'post',
    middleware: upload.single('file'),

    fn(req, res, lively, Tile) {
        return new Promise((resolve, reject) => {
            var file = __dirname + '/../../tiles/' + req.file.filename;

            /*fs.rename(req.file.path, file, function(err) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.json({
                        message: 'File uploaded successfully',
                        filename: req.file.filename
                    });
                }

                resolve();
            });*/
        })
    }
}