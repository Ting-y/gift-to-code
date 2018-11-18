// content of index.js
const http = require('http');
const AWS = require('aws-sdk');
const port = 3000;

const requestHandler = (request, response) => {
    console.log(request.url)
    response.end('Hello Node.js Server!')
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`);

/*    var input = process.argv.slice(2)[0];
    var comprehend = new AWS.Comprehend();
    var params = {
        LanguageCode: 'en' , /!* required *!/
        Text: input /!* required *!/
    };
    comprehend.detectKeyPhrases(params, function (err, data) {
        //var args = process.argv.slice(2);
        if (err) console.log(err, err.stack); // an error occurred
        else  {
            if (!data) return;
            console.log(data);
            data.KeyPhrases[0].Text;
            data.KeyPhrases[0].Score;
            console.log(data);           // successful response
        }
    });*/



});