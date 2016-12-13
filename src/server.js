'use strict';

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import NotFoundPage from './components/NotFoundPage';
import { clientFromConnectionString } from 'azure-iot-device-http';
import { Message } from 'azure-iot-device';

// Initialize Azure
const connectionString = '<REPLACE WITH DEVICE CONNECTION ID>';
const client = clientFromConnectionString(connectionString);

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'static')));

// universal routing and rendering
app.get('*', (req, res) => {
  match(
    { routes, location: req.url },
    (err, redirectLocation, renderProps) => {

      // in case of error display the error message
      if (err) {
        return res.status(500).send(err.message);
      }

      // in case of redirect propagate the redirect to the browser
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      // generate the React markup for the current route
      let markup;
      if (renderProps) {
        // if the current route matched we have renderProps
        markup = renderToString(<RouterContext {...renderProps} />);
      } else {
        // otherwise we can render a 404 page
        markup = renderToString(<NotFoundPage />);
        res.status(404);
      }

      // render the index template with the embedded React markup
      return res.render('index', { markup });
    }
  );
});

// start the server
const port = process.env.PORT || 3001;
const env = process.env.NODE_ENV || 'production';
server.listen(port, "0.0.0.0", err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});

//azure
var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err);
  } else {
    console.log('Controller connected to Azure');

    io.on('connection', function (socket) {
      console.log('Controller connected to Node');
      socket.on('Set', function (data) {
        console.log(data);
        client.sendEvent(new Message(data), function (err) {
          if (err) console.log(err.toString());
        });
      });
      socket.on('Stop', function (data) {
        console.log(data);
        client.sendEvent(new Message(data), function (err) {
          if (err) console.log(err.toString());
        });
      });
      socket.on('Tweet', function (data) {
        console.log(data);
        client.sendEvent(new Message(data), function (err) {
          if (err) console.log(err.toString());
        });
      });
    });
    client.on('message', function (msg) {
      console.log(msg);
      client.complete(msg, function () {
        console.log('completed');
      });
    });
  }
};

client.open(connectCallback);
