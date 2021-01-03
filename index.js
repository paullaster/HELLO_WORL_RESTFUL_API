/*
* Hello Worl API
*This is a RESTful JSON API
*It Listen on a static port 7000
*HTTP request send to route /hello returns a message  in JSON format
*
*
*/

//Dependecies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;





//Instanciate server
const server = http.createServer((req, res) =>{
 
    //Get passed url
    let parsedUrl = url.parse(req.url, true);

    //Get the path
     let path = parsedUrl.pathname;

     //Triming the path
     let trimedPath = path.replace(/^\/+|\/+$/g, '');

     //Get query string as obj
    let queryStringObject = parsedUrl.query;

    //Get the HTTP method
    let method = req.method.toLocaleLowerCase();

    //Headers
    let headers = req.headers;

    //Payload if any
    const decoder = new StringDecoder('utf-8');
    let dataChunks = '';
    req.on('data', (data) =>{
        dataChunks += decoder.write(data);
    });

    req.on('end', () =>{
        dataChunks += decoder.end();
    })

    //Choose the  handler the request should route to, or default to Not Found handler
    let chooseHandler = typeof(route[trimedPath]) !== 'undefined' ? route[trimedPath] : handler.notFound;

    //Data Object to send to the handler

    let data = {
        'trimedPath': trimedPath,
        'queryStringObject': queryStringObject,
        'method': method,
        'Headers':headers,
        'payload' : dataChunks,
    };

    //Route request to specified handler
    chooseHandler(data, (statusCode, payload) =>{
        //Use th status code called  by the call back or default to 201
        statusCode = typeof(statusCode) ==='number' ? statusCode : 201;

        //Payload called by call back or default to empty
        payload = typeof(payload) ==='object' ? payload : {};


        //payload -> String
        payloadString = JSON.stringify(payload);

        //Response
    res.setHeader('content-type', 'application/json');
    res.writeHead(statusCode);
    res.end(payloadString);
    // res.end('Hello Paullaster at Pirple.com')

    });


    
});


//Start server
server.listen(7000, (req, res) =>{
 console.log('The server is start on port 7000');
});

//Handlers
let handler = {

};

//Hello handler
handler.hello = (data, cb)=>{
cb(201, {'message': "Welcome to the Hello world JSON API, This API file was originally created by Paullaster Okoth"})
};

//Not found handler
handler.notFound = (data, cb) =>{
    cb(404, {'Message': "The page specified not found"});
};

//Route
let route = {
    'hello': handler.hello,
};