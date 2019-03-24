import React from 'react'
import dateFormat from 'dateformat'

import './Movie.css'

const TMDB_IMG_URL = "http://image.tmdb.org/t/p/w500"

class Movie extends React.Component {
    constructor() {
        super()
        this.state = { your_note: '', showingNote: false }
        this.setNote = this.setNote.bind(this)
    }
    render() {
        const {detail, type, query, favorite} = this.props
        const {your_note, showingNote} = this.state
        const MOVIE_IMG_SRC = detail.poster_path ? `${TMDB_IMG_URL}${detail.poster_path}` : '/placeholder.png'
        const release_date = detail.release_date ? new Date(detail.release_date) : null
        return (
                <div className="movie">
                    {
                        favorite &&
                        <div className="movie__favorite">
                            <button className="movie__favorite__button movie__favorite__delete" onClick={(event) => { this.deleteFavorites(event) }}>Eliminar</button>
                            <button className="movie__favorite__button" onClick={this.showNote}>Editar Nota</button>
                            {
                                showingNote &&
                                <>
                                    <input className="movie__favorite__input" type="number" min="0" max="10" value={your_note} placeholder="Tu nota (0-10)" onChange={this.setNote} onClick={(event) => { event.preventDefault() }}/>
                                    <button className="movie__favorite__button" onClick={(event) => { this.editNote(event) }}>Confirmar</button>
                                    <button className="movie__favorite__button" onClick={this.hideNote}>Cancelar</button>
                                </>
                            }
                        </div>
                    }
                    <img className='movie__pic' src={MOVIE_IMG_SRC} alt={detail.title} />
                    {
                        ((type === 'vote_average' && !query) || !detail.poster_path || !type) &&
                        <div className='movie__fringe'>
                            <span className='movie__fringe__title'>{detail.title}</span>
                            {
                                (detail.poster_path || !type) ? 
                                <span className='movie__fringe__info'>
                                    {(type ? `(Nota: ${detail.vote_average})` : `(Tu Nota: ${detail.your_note ? detail.your_note : '-'})` )}
                                </span>
                                : (release_date ? <span className='movie__fringe__date'>{`(${dateFormat(release_date, "yyyy")})`}</span> : '')
                            }
                        </div>
                    }
                </div>
        )
    }

    showNote = (event) => {
        event.preventDefault()
        this.setState({ showingNote: true })
    }

    hideNote = (event) => {
        event.preventDefault()
        this.setState({ showingNote: false })
    }

    setNote (event) {
        event.preventDefault()
        this.setState({ your_note: event.target.value })
    }

    editNote(event){
        event.preventDefault()
        const {your_note} = this.state
        if(your_note >= 0 && your_note <= 10 ){
            const {detail, favorite: collection} = this.props
            const favorites = JSON.parse(localStorage.getItem("favorites")) || {}
            let index = favorites[collection].findIndex(x => x.id === detail.id)
            favorites[collection][index]['your_note'] = your_note
            localStorage.setItem("favorites", JSON.stringify(favorites))
            this.setState({ your_note: '', showingNote: false })
            this.props.action(favorites)
        }
    }

    deleteFavorites(event){
        event.preventDefault()
        const {detail, favorite: collection} = this.props
        const favorites = JSON.parse(localStorage.getItem("favorites")) || {}
        favorites[collection] = favorites[collection].filter(movie => (movie.id !== detail.id))
        if(!favorites[collection].length){
            delete favorites[collection]
        }
        localStorage.setItem("favorites", JSON.stringify(favorites))
        this.props.action(favorites)
    }

}

export default Movie 