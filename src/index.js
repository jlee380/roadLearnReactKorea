import React, { Component } from 'react';
import { render } from 'react-dom';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const isSearched = (searchTerm) => item =>

  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

  }

  setSearchTopStories = (result) => {
    console.log(result);
    this.setState({ result, });
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);    
    this.setState({ result: { ...this.state.result, hits: updatedHits } });
  }

  handleChange = (e) => {
    this.setState({ searchTerm: e.target.value })
    console.log(this.state.searchTerm);
  }

  render() {
    const { result, searchTerm } = this.state;
    if (!result) { return null; }
    return (
      <div className="page">
        <div className="interactions">
          <div className="App">
            <Search
              value={searchTerm}
              onChange={this.handleChange}>
            </Search>
          </div>
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss} />
        </div>
      </div>
    );
  }
}

const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map((item) => {
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
            >Dismiss</Button>
          </span>
        </div>
      );
    })}
  </div>

const Button = ({ onClick, className = '', children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

const Search = ({ value, onChange, children }) => {
  return (
    <form>
      {children}
      <input
        value={value}
        onChange={onChange}
        type="text" />
    </form>
  );
}


render(<App />, document.getElementById('root'));
