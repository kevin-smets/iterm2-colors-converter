const del = require('del');
const ghdownload = require('github-download');
const path = require('path');

const dir = path.join(process.cwd(), 'download');

del(dir).then(function() {
    ghdownload({user: 'mbadolato', repo: 'iTerm2-Color-Schemes', ref: 'ab1ebe4', dir: 'download'}, dir)
        .on('dir', function (dir) {
            console.log(dir)
        })
        .on('file', function (file) {
            console.log(file)
        })
        .on('zip', function (zipUrl) { //only emitted if Github API limit is reached and the zip file is downloaded
            console.log(zipUrl)
        })
        .on('error', function (err) {
            console.error(err)
        })
        .on('end', function () {
            console.log("Download complete")
        });
});

