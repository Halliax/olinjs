import React, { Component } from 'react';
// Delete commented-out code before submitting it
import './App.css';


// Encapsulates all list components
var App = React.createClass({
  // App stores list items (inititializes blank)
  getInitialState: function(){
    return {
      items: [],
      counter: 0,
      // I'd name this 'editingIndex', it's more clear what it does then
      editFlag: undefined,
      // I'd make these just the strings 'All','Active', etc to be more readable
      // or have these be integers, but not strings of integers
      selectedFilter: '0'
    }
  },
  // Function to pass to addItem object, takes an item, stores, updates
  addItem: function(item){
    // Only modify state using setState, don't directly increment counter.
    this.state.items.push(item);
    this.state.counter++;
    this.setState({
      items: this.state.items
    });
  },
  // push edits by index of current edit flag, unset edit flag
  editItem: function(item){
    const items = this.state.items;
    items[this.state.editFlag] = {name: item.name, checked: items[this.state.editFlag].checked};
    // You can combine these two setState's like so:
    this.setState({
      items,
      editFlag: undefined
    });
  },
  // delete item by index
  deleteItem: function(index){
    const items = this.state.items;
    if (!items[index].checked) {
      this.state.counter--;
    }
    items.splice(index, 1);
    this.setState(items);
  },
  // sets edit flag when edit button is clicked
  clickEdit: function(index){
    this.setState({
      editFlag: index
    });
  },
  // toggle checked field by index
  toggleChecked: function(index){
    const items = this.state.items;
    items[index] = {name: items[index].name, checked: !items[index].checked};
    this.setState(items);
    if(items[index].checked) {
      this.state.counter--;
    } else {
      this.state.counter++;
    }
  },
  // handle radio button filter changes
  handleFilter: function(e){
    this.setState({
      selectedFilter: e.target.value
    });
  },
  // render title, addItem object, item list
  render: function(){
    return (
      <div>
        <h3>To Do</h3>
        <AddItem addNew={this.addItem} prev='' />
        <h4>Items</h4>
        <List
          items={this.state.items}
          editFlag={this.state.editFlag}
          toggleChecked={this.toggleChecked}
          clickEdit={this.clickEdit}
          editItem={this.editItem}
          deleteItem={this.deleteItem}
          selectedFilter={this.state.selectedFilter}/>
        <p>Active: {this.state.counter}</p>
        <Options selected={this.state.selectedFilter} handleChange={this.handleFilter} />
      </div>
    )
  }
});

// Input box component
var AddItem = React.createClass({
  // box starts blank, state is stored in newItem field
  getInitialState: function(){
    return {
      newItem: {name:this.props.prev, checked:false}
    }
  },
  // checks that it was passed a function from App
  propTypes: {
    addNew: React.PropTypes.func.isRequired
  },
  // update newItem component state when text field changes
  updateNewItem: function(e){
    this.setState({
      newItem: {name:e.target.value, checked:false}
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
  // turns the items array from props into ListItems, renders into list
  render: function() {
    // No need to save all these in variables, just reference props when
    // you need to access them.
    var toggleChecked = this.props.toggleChecked;
    var onClickEdit = this.props.clickEdit;
    var editItem = this.props.editItem;
    var flag = this.props.editFlag;
    var onDelete = this.props.deleteItem;
    var filter = this.props.selectedFilter;
    // filters items for rendering based on selectedFilter option
    var activeItems = this.props.items.filter(function(item) {
      if(filter === '0' || filter === '1' && !item.checked || filter === '2' && item.checked){
        return item;
      }
    });
    // renders filtered items
    var listItems = activeItems.map(function(item,i){
      if(i === flag) {
        return <AddItem addNew={editItem} prev={item.name} />
      }
      else {
        return <ListItem name={item.name}
                checked={item.checked}
                index={i}
                toggleChecked={toggleChecked}
                onClickEdit={onClickEdit}
                onDelete={onDelete}/>;
      }
    });
    return (
        <div>
          <ul>
            {listItems}
          </ul>
        </div>
    );
  }
});

// render component for list items
var ListItem = React.createClass({
  render: function() {
    return (
      <div>
        <label onDoubleClick={() => this.props.onClickEdit(this.props.index)}>
          <input type="checkbox"
          checked={this.props.checked}
          onChange={() => this.props.toggleChecked(this.props.index)} />
          {this.props.name}</label>
        <input type="button"
          value="X"
          onClick={() => this.props.onDelete(this.props.index)} />
      </div>
    );
  }
});

// radio buttons for filtering
var Options = React.createClass({
  // render form
  render: function() {
    return (
      <form>
        <div className="radio">
          <label>
            <input type="radio" value='0'
              checked={this.props.selected === '0'}
              onChange={this.props.handleChange} />
            All
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value='1'
              checked={this.props.selected === '1'}
              onChange={this.props.handleChange} />
            Active
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value='2'
              checked={this.props.selected === '2'}
              onChange={this.props.handleChange} />
            Completed
          </label>
        </div>
      </form>
    );
  }
});

export default App;
