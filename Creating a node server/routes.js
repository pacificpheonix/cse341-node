const fs = require('fs');

const requestHandler = (req, res) => {
  const url    = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Say something!</title></head>');
    res.write('<body><h1>(Im giving up on you)</h1>');
    res.write('<form action="/message" method="POST"><input type="text" name ="message"><button type="submit">Send</button></form></body>')
    res.write('</html>');
    return res.end();
  }
  if (url === '/message'  && method === 'POST'){
    const body = [];
    req.on('data', (chunk) => {
      //console.log(chunk);
      body.push(chunk);
    });
  
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      //console.log(parsedBody);
      const message = parsedBody.split('=')[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", '/')
        return res.end();
      });
    });
  }
  
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>First page ayo waddup</title></head>');
  res.write('<body><h1>Welcome!</h1></body>');
  res.write('</html>');
  res.end(); //it is ended, going back to the client
};


module.exports = requestHandler;

  
  