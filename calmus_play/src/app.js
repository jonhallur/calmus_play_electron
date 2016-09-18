import { Render, Middleware } from 'jumpsuit'
/* state */
import state from 'state/index'
/* screens */
import Calmus from 'screens/calmus'
import Main from 'screens/index'
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

const router = routerMiddleware(hashHistory);
Middleware(router);

Render(state, (
  <Main>
    <Calmus />
  </Main>
));
