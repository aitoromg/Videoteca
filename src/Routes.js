import React from 'react'
import { Switch, Route } from 'react-router'

import Discover from './Discover'
import Favorites from './Favorites'
import Detail from './Detail'

export default () =>
  <Switch>
    <Route exact path='/' render={props => <Discover {...props} type='vote_average'/>} />
    <Route exact path='/discover' render={props => <Discover {...props} type='popularity'/>} />
    <Route exact path='/favorites' component={Favorites} />
    <Route exact path='/movie/:id' render={props => <Detail {...props} id={props.match.params.id}/>} />
    <Route component={() => <p>Error 404, no hemos encontrado lo que buscas</p>} />
  </Switch>