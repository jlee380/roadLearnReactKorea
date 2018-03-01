import React, { Component } from 'react';
import { render } from 'react-dom';
import './index.css';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: '3',
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abromov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

//function isSearched(searchTerm) {
// return function (item) {
// return item.title.toLowerCase().includes(searchTerm.toLowerCase());
// }
//}

const isSearched = (searchTerm) => item =>

  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

      list,
      searchValue: '',
    };

  }

  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  handleChange = (e) => {
    this.setState({ searchValue: e.target.value })
    console.log(this.state.searchValue);
  }

  render() {
    const { list, searchValue } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <div className="App">
            <Search
              value={searchValue}
              onChange={this.handleChange}>
            </Search>
          </div>
            <Table
              list={list}
              pattern={searchValue}
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