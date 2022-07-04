import * as express from 'express';
import * as Middleware from '../middleware/middleware';
import * as Routes from '../../routes';

/**
 * @constant {express.Application}
 */
const app: express.Application = express();

/**
 * @constructs express.Application Middleware
 */
Middleware.configure(app);

/**
 * @constructs express.Application Routes
 */
Routes.init(app);

/**
 * @constructs express.Application Error Handler
 */
Middleware.initErrorHandler(app);

/**
 * sets port 3000 to default or unless otherwise specified in the environment
 */
app.set('port', process.env.PORT || 3000);

/**
 * sets secret to 'superSecret', otherwise specified in the environment
 */
app.set('secret', process.env.SECRET || '056b7fe47141b6e48e87caf8f8e5bb92120ac12c6e6944cf7dbcda2db23581cc');

/**
 * @exports {express.Application}
 */
export default app;
