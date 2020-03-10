function creature(name,type){
  this.name = name;
  this.type = type;
  this.changeName = function(newName){
    this.name = newName;
  };
}

class CreatureDisplay extends React.Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
   this.props.creature.changeName(event.target.value);
    this.forceUpdate();
  }

  render() {
  return(
    <div>
    <p>{this.props.creature.name}</p>
    <input type="text" value={this.props.creature.name} onChange={this.handleChange} />
      <input type="text" value={this.props.creature.name} onChange={this.handleChange} />
      </div>
  );}
}

ReactDOM.render(
  <CreatureDisplay creature={new creature("test1","test")} />,
  document.getElementById('root')
);
