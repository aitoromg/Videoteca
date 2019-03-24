import React from 'react'
import { Link } from 'react-router-dom'

import Showcase from './Showcase'
import Movie from './Movie'

import './Favorites.css'

export default class extends React.Component {
    constructor() {
        super()
        this.state = {
            favorites: []
        }
        this.updateFavorites = this.updateFavorites.bind(this);
    }

    componentDidMount() {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || {}
        this.updateFavorites(favorites)
    }

    render() {
        const { favorites } = this.state
        return (
            <>
                {
                    (!favorites || favorites.length === 0) &&
                    <p>No se ha añadido ninguna película como favorita</p>
                }
                {
                    favorites && Object.keys(favorites).length > 0 && 
                    <ul className="favorites">
                    {
                        Object.keys(favorites).map(collection =>
                            <li key={collection} className='favorites__collection'>
                              <h1 className='favorites__collection__title'>Colección: <span className='favorites__collection__name'>{collection}</span></h1>
                              <Showcase keyFn={movie => movie.id} items={favorites[collection]} render={movie =>
                                  <Link to={`/movie/${movie.id}`}>
                                      <Movie detail={movie} favorite={collection} action={this.updateFavorites}/>
                                  </Link>
                              } />
                            </li>
                        )
                    }
                    </ul>
                }
            </>
        )
    }

    updateFavorites(favorites) {
        this.setState({ favorites })
    }
} 