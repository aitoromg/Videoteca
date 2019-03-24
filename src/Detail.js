import React from 'react'
import dateFormat from 'dateformat'

import './Detail.css'

const TMDB_IMG_URL = "http://image.tmdb.org/t/p/w500"
const TMDB_MOVIE_URL = `https://api.themoviedb.org/3/movie/TMDB_MOVIE_ID?api_key=d7873befdfa24c79ae93d005a7621ef0&language=es-ES`

class Detail extends React.Component {
    constructor() {
        super()
        this.state = { movie: {}, loading: false, error: false, showingFav: false, collection_name: '' }
        this.setCollectionName = this.setCollectionName.bind(this)
        this.addFavorites = this.addFavorites.bind(this)
    }
    async componentDidMount() {
      this.setState({ loading: true })
      try {
          const response = await fetch(TMDB_MOVIE_URL.replace('TMDB_MOVIE_ID', this.props.id))
          const movie = await response.json()
          this.setState({ movie })
      } catch (error) {
          this.setState({ error: true })
      } finally {
          this.setState({ loading: false })
      }
    }
    render() {
        const { 
            movie,
            loading,
            error,
            showingFav,
            collection_name
        } = this.state
        if (loading) {
            return <p>Cargando...</p>
        }
        if (error) {
            return <p>Error 500!!!</p>
        }
        const MOVIE_IMG_SRC = `${TMDB_IMG_URL}${movie.poster_path}`
        return (
            <div className="detail">
                <h1 className='detail__title'>{movie.title}</h1>
                <div className="detail__left">            
                    <dl className='detail__description'>
                        {
                            movie.original_title &&
                            <>
                                <dt className='detail__description__title'>Titulo original</dt>
                                <dd className='detail__description__info'>{movie.original_title}</dd>
                            </>
                        }
                        {
                            movie.release_date &&
                            <>
                                <dt className='detail__description__title'>Año</dt>
                                <dd className='detail__description__info'>{dateFormat(movie.release_date, "yyyy")}</dd>
                            </>
                        }
                        {
                            movie.runtime &&
                            <>
                                <dt className='detail__description__title'>Duración</dt>
                                <dd className='detail__description__info'>{movie.runtime} min.</dd>
                            </>
                        }
                        {
                            movie.genres &&
                            <>
                                <dt className='detail__description__title'>Género</dt>
                                <dd className='detail__description__info detail__description__info--special'>{movie.genres.map((genre, index) => genre.name).join(' | ')}</dd>
                            </>
                        }
                        {
                            movie.overview &&
                            <>
                                <dt className='detail__description__title'>Sinopsis</dt>
                                <dd className='detail__description__info'>{movie.overview}</dd>
                            </>
                        }
                    </dl>
                </div>
                <div className="detail__right">
                    {
                        movie.poster_path &&
                        <img className='detail__pic' src={MOVIE_IMG_SRC} alt={movie.title} />
                    }
                    <div className="detail__favorite">
                        <button className="detail__favorite__button detail__favorite__add" onClick={this.showFav}>Añadir a Favoritos</button>
                        {
                            showingFav &&
                            <>
                                <input className="detail__favorite__input" type="text" value={collection_name} placeholder="Nombre de colección..." onChange={this.setCollectionName}/>
                                <button className="detail__favorite__button" onClick={this.addFavorites}>Añadir</button>
                                <button className="detail__favorite__button" onClick={this.hideFav}>Cancelar</button>
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    }

    showFav = () => {
        this.setState({ showingFav: true })
    }

    hideFav = () => {
        this.setState({ showingFav: false })
    }

    setCollectionName (event) {
        this.setState({ collection_name: event.target.value })
    }

    addFavorites() {
        const { 
            movie,
            collection_name
        } = this.state
        const favorites = JSON.parse(localStorage.getItem("favorites")) || {}
        if(Object.keys(favorites).length){
            if(favorites[collection_name] && favorites[collection_name].length){
                if (favorites[collection_name].findIndex(x => x.id === movie.id) === -1){
                    favorites[collection_name].push(movie);
                }
            } else {
                favorites[collection_name] = [movie]
            }
        } else {
            favorites[collection_name] = [movie]
        }
        localStorage.setItem("favorites", JSON.stringify(favorites))
        this.setState({ collection_name: '', showingFav: false })
    }
    
}

export default Detail 