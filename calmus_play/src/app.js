import { Render, Middleware } from 'jumpsuit'
/* state */
import state from 'state/index'
/* screens */
import Entry from 'screens/entry'
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

const router = routerMiddleware(hashHistory);
Middleware(router);

Render(state,
  (<Entry/>)
);
