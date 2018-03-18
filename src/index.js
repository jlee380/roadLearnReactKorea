import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { render } from 'react-dom';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

// const isSearched = (searchTerm) => item =>

//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      error: null,
      searchTerm: DEFAULT_QUERY,
    };

  }

  setSearchTopStories = (result) => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({ 
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      } 
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;

    this.fetchSearchTopStories(searchTerm);
    this.setState({ searchKey: searchTerm });
  }

  onDismiss = (id) => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);    

    this.setState({ 
      results: { 
        ...results, 
        [searchKey]: { hits: updatedHits, page }
      } 
    });
  }

  handleChange = (e) => {
    this.setState({ searchTerm: e.target.value })
  }

  onSearchSubmit = (e) => {
    const { searchTerm } = this.state;

    this.fetchSearchTopStories(searchTerm);
    this.setState({ searchKey: searchTerm });

    if(this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    e.preventDefault();
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }

  needsToSearchTopStories = (searchTerm) => {
    return !this.state.results[searchTerm];
  }

  render() {
    const { results, searchTerm, searchKey, error } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    if (error) {
      return 
    }

    if (!results) { return null; }
    return (
      <div className="page">
        <div className="interactions">
          <div className="App">
            <Search
              value={searchTerm}
              onChange={this.handleChange}
              onSubmit={this.onSearchSubmit}
            >
              Submit
            </Search>
          </div>
          {
            error 
            ? <div className="interactions"><p>Something went wrong</p></div>
            : <Table
                list={list}
                onDismiss={this.onDismiss} 
              />    
          }
        </div>
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

export const Table = ({ list, onDismiss }) =>
  <div className="table">
    {list.map((item) => {
      return (
        <div key={item.objectID} className="table-row">
          <span>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={{ width: '40%' }}>{item.author}</span>
          <span style={{ width: '30%' }}>{item.num_comments}</span>
          <span style={{ width: '10%' }}>{item.points}</span>
          <span style={{ width: '10%' }}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div>
      );
    })}
  </div>

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,

  onDismiss: PropTypes.func.isRequired,
};

export const Button = ({ onClick, className, children }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  className: '',
};

export const Search = ({ value, onChange, onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        value={value}
        onChange={onChange}
        type="text" 
      />
      <button type="submit">
        {children}
      </button>
    </form>
  );
}


export default App;