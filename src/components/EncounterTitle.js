import React from 'react';

class EncounterTitle extends React.Component{
    constructor(props){
        super(props);
        this.change_title = this.change_title.bind(this);
        this.change_round = this.change_round.bind(this);
    }

    change_title(event){
        this.props.encounter.set_name(event.target.value);
    }

    change_round(event){
        var value = parseInt(event.target.value);
        if (isNaN(value)){
            value = 0;
        }
        this.props.encounter.set_round(value);
    }

    render(){
        return(
            <div>
                <input type="text" value={this.props.encounter.name} size="25" class="encounter_title" onChange={this.change_title}/>
                <p class="encounter_title">&nbsp; Round: </p>
                <input type="text" value={this.props.encounter.round === 0?"":this.props.encounter.round} size="1" class="encounter_title" onChange={this.change_round}/>
            </div>
        )
    }
}

export default EncounterTitle;