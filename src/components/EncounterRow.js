import React from 'react';
import Constants from './../Constants';
import NpCreature from './../creatures/NpCreature';

class EncounterRow extends React.Component{
    constructor(props){
        super(props);
        this.get_row_color = this.get_row_color.bind(this);
        this.set_roll = this.set_roll.bind(this);
        this.select = this.select.bind(this);
        this.set_token = this.set_token.bind(this);
        this.set_HP = this.set_HP.bind(this);
    }

    get_row_color(){
        const creature = this.props.creature;
        if (creature.selected){
            return Constants.selected_color;
        }
        else if (creature === this.props.encounter.creatures[this.props.encounter.active_turn]){
            return Constants.turn_color;
        }
        else if (creature.dead){
            return Constants.dead_color;
        }
        else {
            return Constants.creature_table_color;
        }
    }

    set_roll(event){
        this.props.creature.set_roll(event.target.value);
    }

    select(){
        this.props.creature.select();
    }

    set_token(event){
        this.props.creature.set_token(event.target.value);
    }

    set_HP(event){
        this.props.creature.set_HP(event.target.value);
    }

    render(){
        return(
            <tr class="creatre_table" style={{backgroundColor: this.get_row_color()}}>
                <td class="creature_table"><input type="text" size="3" value={this.props.creature.roll} onChange={this.set_roll}></input></td>
                <td class="creature_table clickable" style={{fontWeight: !(this.props.creature.creature instanceof NpCreature) ? "bold" : "normal"}} onClick={this.select}>{this.props.creature.name}</td>
                <td class="creature_table">{(this.props.creature.creature instanceof NpCreature) ? <input type="text" size="4" value={this.props.creature.token} onChange={this.set_token}></input> : null}</td>
                <td class="creature_table">{(this.props.creature.creature instanceof NpCreature) ? <input type="text" size="4" value={this.props.creature.HP} onChange={this.set_HP}></input> : null}</td>
                <td class="creature_table">{this.props.creature.creature.AC}</td>
            </tr>
        )
    }
}

export default EncounterRow;