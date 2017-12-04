import React, {Component} from 'react'
import { Link } from 'react-router-dom'

import FaStar from 'react-icons/lib/fa/star'
import immutable from 'immutable'

import Api from './Api'
import { Bootstrap3ishPaginator } from 'react-paginators'

const api = new Api(`http://127.0.0.1:4000`);

const FavoriteButton = ({isFavorite, onClick}) => (
    <FaStar style={{cursor: "pointer"}} color={isFavorite ? "#ffa500" : "#eee"} onClick={onClick}   e/>
);

class List extends Component {
    constructor(props) {
        super(props);
        this.state = { articles: [] }
    }

    componentWillMount() {
        api.listArticles().then((result) => {
            this.setState({articles: result.articles, current: 1, last: result.links.last._page})
        })
    }

    handlePageClick(page) {
        api.listArticles(page).then((result) => {
            this.setState({articles: result.articles, current: page, last: result.links.last._page})
        })
    }


    handleFavorite(article, index) {
        article.isFavorite = article.isFavorite !== true;
        api.updateArticle(article.id, article).then((result) => {
            const nextArticles = immutable.List(this.state.articles);
            nextArticles[index] = result.article;
            this.setState({articles: nextArticles})
        })
    }

    render() {
        const current = this.state && this.state.current || 1;
        const last = this.state && parseInt(this.state.last, 10) || 1;

        return (
            <div>
                <h2>Articles</h2>
                <ul>
                    {this.state.articles.map((article, index) => (
                        <li key={index}>
                            <Link to={`/articles/${article.id}`}>{article.title}</Link>
                            {" "}
                            <FavoriteButton isFavorite={article.isFavorite} onClick={() => this.handleFavorite(article, index)}/>
                        </li>
                    ))}
                </ul>
                <div style={{padding: "30px", display: "flex", justifyContent: "center"}}>
                    <Bootstrap3ishPaginator
                        current = {current}
                        last = {last}
                        maxPageCount = {10}
                        onClick = {this.handlePageClick.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

class FavoriteList extends Component {

    constructor(props) {
        super(props);
        this.state = { article: {} }
    }

    componentWillMount() {
        api.listFavariteArticles().then((result) => {
            this.setState({articles: result.articles})
        })
    }

    render(){
        return(
            <div>
                <h2>Favorite Articles</h2>
            </div>
        )
    }
}

class Show extends Component {
    constructor(props){
        super(props);
        this.state = { articles: {} }
    }

    componentWillMount() {
        const { id } = this.props.match.params;
        api.showArticle(parseInt(id, 10)).then((result) => {
            this.setState({article: result.article})
        })
    }

    render(){
        const {article} = this.state;
        return(
            <div>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
            </div>
        )
    }
}

export default { List, FavoriteList, Show }
