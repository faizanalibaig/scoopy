import http from 'http';

const server = http.createServer(
  (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
  ) => {
    /* log page not found if the route is not main */
    if (req.url !== '/') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('page not found, sorry');
    }

    /* main route */
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello from scoopy');
  }
);

const port = process.env.PORT || 3000;
server.listen(port);
