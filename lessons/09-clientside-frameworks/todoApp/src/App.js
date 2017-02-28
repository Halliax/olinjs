import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


// Encapsulates all list components
var App = React.createClass({
  // App stores list items (inititializes blank)
  getInitialState: function(){
    return {
      items: []
    }
  },
  // Function to pass to addItem object, takes an item, stores, updates
  addItem: function(item){
    this.state.items.push(item);
    this.setState({
      items: this.state.items
    });
  },

  toggleChecked: function(id){
    const items = this.state.items;
    var index = items.indexOf(function (obj) {
      return obj.id === id;
    });
    items[index] = {id: id, checked: !items[index].checked};
    this.setState(items);
  },
  // render title, addItem object, item list
  render: function(){
    return (
      <div>
        <h3>To Do</h3>
        <AddItem addNew={this.addItem} />
        <List items={this.state.items} toggleChecked={this.toggleChecked.bind(this)} />
      </div>
    )
  }
});

// Input box component
var AddItem = React.createClass({
  // box starts blank, state is stored in newItem field
  getInitialState: function(){
    return {
      newItem: {name:'', checked:false}
    }
  },
  // checks that it was passed a function from App
  propTypes: {
    addNew: React.PropTypes.func.isRequired
  },
  // update newItem component state when text field changes
  updateNewItem: function(e){
    this.setState({
      newItem: {name:e.target.value, checked:false, id:e.target.value}
    });
  },
  // handles form submission, passes new value to App addItem function
  handleAddNew: function(e){
    e.preventDefault();
    this.props.addNew(this.state.newItem);
    this.setState({
      newItem: {name:'', checked:false}
    });
  },
  // an input box, in a form so enter submits instead of a button
  render: function(){
    return (
        <div>
          <form onSubmit={this.handleAddNew}>
            <input
              type="text"
              value={this.state.newItem.name}
              onChange={this.updateNewItem} />
          </form>
        </div>
    );
  }
});

// list of current items
var List = React.createClass({
  // if no items array passed in from props, uses blank array
	getDefaultProps: function() {
  	return {
    	items: []
    }
  },
  // turns the items array from props into lis, renders into list
  render: function() {
    var toggleChecked = this.props.toggleChecked;
    var listItems = this.props.items.map(function(item){
      return <ListItem name={item.name} checked={item.checked} id={item.id} onChange={toggleChecked} />;
    });
    return (
        <div>
          <form>
            {listItems}
          </form>
        </div>
    );
  }
});

// render component for list items
var ListItem = React.createClass({
  render: function() {
    return (
      <div>
        <label><input type="checkbox"
          checked={this.props.checked}
          onChange={() => this.props.onChange(this.props.id)} />
          {this.props.name}</label>
      </div>
    );
  }
});


export default App;
