const fs = require("fs");
const http = require("http");
const { json } = require("stream/consumers");
const url = require("url");
const replaceTemplate = require('./modules/replaceTemplate.js')
PORT = 8000;

//sync file


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    // console.log(req.url);
    // console.log(url.parse(req.url, true))
    //query and pathname have to match the url name
  const {query, pathname} = url.parse(req.url, true)

//   pathName = req.url;

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {'Content-type': 'text/html'});

    const cardHTML = dataObj.map(obj=> replaceTemplate(tempCard, obj)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHTML)

    res.end(output);
    // console.log(cardHTML)

  } 
  //PRODUCT PAGE
  else if (pathname === "/product") {
    res.writeHead(200, {'Content-type': 'text/html'})
    const product = dataObj[query.id];

    const output = replaceTemplate(tempProduct, product)
    res.end(output)
    // res.end("Node Farm Product");


  }  
  
  //API
  else if (pathname === "/api") {
   
      res.writeHead(200, {'Content-type': 'application/json'});
      res.end(data);
    
    // res.end("API");
  }else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page Not Found</h1>");
  }

});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`listening to requests on port: ${PORT}`);
});
