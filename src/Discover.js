import React from 'react'
import { Link } from 'react-router-dom'
import dateFormat from 'dateformat'

import Showcase from './Showcase'
import Movie from './Movie'

import './Discover.css'

const TMDB_DISCOVER_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=SORT_BY.desc&api_key=d7873befdfa24c79ae93d005a7621ef0&language=es-ES&region=ES&EXTRA_PARAMS`
const TMDB_SEARCH_URL = `https://api.themoviedb.org/3/search/movie?query=QUERY&api_key=d7873befdfa24c79ae93d005a7621ef0&language=es-ES&region=ES`

export default class extends React.Component {
    constructor() {
        super()
        this.state = { movies: [], query: '', searched: false, loading: false, error: false }
        this.discover = this.discover.bind(this)
        this.search = this.search.bind(this)
        this.setQuery = this.setQuery.bind(this)
    }
    componentDidMount() {
        this.discover()
    }
    componentDidUpdate(prevProps) {
        if(this.props.type !== prevProps.type){
           this.discover()
        }
    } 
    render() {
        const { 
            movies,
            query,
            searched,
            loading,
            error
        } = this.state
        if (error) {
            return <p>Error 500!!!</p>
        }
        return (
            <div className="discover">
                <input className="discover__search" type="text" value={query} placeholder="Buscar..." onKeyPress={this.search} onChange={this.setQuery}/>
                {
                        !loading &&
                        <Showcase keyFn={movie => movie.id} items={movies} render={movie =>
                            <Link to={`/movie/${movie.id}`}>
                                <Movie detail={movie} type={this.props.type} query={!!searched}/>
                            </Link>
                        } />
                } 
                {
                        movies.length === 0 && !loading &&
                        <p>No hay resultados</p>
                }
            </div>
        )
    }
    async discover(){
        this.setState({ loading: true, searched: false })
        try {
            const now = new Date()
            const this_year = dateFormat(now, "yyyy")
            const response = await fetch(TMDB_DISCOVER_URL.replace('SORT_BY', encodeURI(this.props.type)).replace('EXTRA_PARAMS', encodeURI(this.props.type !== 'vote_average' ? '' : `primary_release_year=${this_year}&vote_count.gte=50`)))
            const { results: movies } = await response.json()
            this.setState({ movies })
        } catch (error) {
            this.setState({ error: true })
        } finally {
            this.setState({ loading: false })
        }
    }
    async search(event) {
        if (event.key === 'Enter') {
            const query = event.target.value
            if (query.trim() === '') {
                this.setState({ 
                    movies: [], 
                    query: '',  
                    loading: false, 
                    error: false  
                })
            } else {     
                this.setState({ loading: true })
                try {
                    const response = await fetch(TMDB_SEARCH_URL.replace('QUERY', encodeURI(query)))
                    const { results: movies } = await response.json()
                    this.setState({ movies , query: '', searched: true})
                } catch (error) {
                    this.setState({ error: true })
                } finally {
                    this.setState({ loading: false })
                }
            }
        }
    }
    setQuery (event) {
        this.setState({ query: event.target.value })
    }
} 