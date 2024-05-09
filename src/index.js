import * as Sentry from '@sentry/node';
import express from 'express';
import 'dotenv/config';

import usersRouter from './routes/users.js';
import hostsRouter from './routes/hosts.js';
import propertiesRouter from './routes/properties.js';
import amenitiesRouter from './routes/amenities.js';
import bookingsRouter from './routes/bookings.js';
import reviewsRouter from './routes/reviews.js';
import loginRouter from './routes/login.js';
import errorHandler from './middleware/errorHandler.js';
import log from './middleware/logMiddleware.js';
import NotFoundError from './errors/NotFoundError.js';

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app })
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0 //  Capture 100% of the transactions
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Global middleware
app.use(express.json());
app.use(log);

// Resource routes
app.use('/users', usersRouter);
app.use('/hosts', hostsRouter);
app.use('/properties', propertiesRouter);
app.use('/amenities', amenitiesRouter);
app.use('/bookings', bookingsRouter);
app.use('/reviews', reviewsRouter);

app.use('/login', loginRouter);

// For all other (unmatched) routes, throw a NotFoundError
app.use((req, res, next) => {
  const protocol = req.protocol;
  const host = req.hostname;
  const url = req.originalUrl;
  const method = req.method;
  const port = process.env.PORT || 3000;
  const fullUrl = `${req.protocol}://${req.hostname}:${
    process.env.PORT || 3000
  }${req.originalUrl}`;

  if (!req.route) return next(new NotFoundError('route', fullUrl));
  next();
});

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Error handling
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
