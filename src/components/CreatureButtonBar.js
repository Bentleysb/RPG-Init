import React from 'react';
import EncounterCreature from '../encounters/EncounterCreature';
import RenderFunctions from './../RenderFunctions';

class CreatureButtonBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {roll_MHP: false};
        this.add_to_encounter = this.add_to_encounter.bind(this);
        this.add_selected_to_encounter = this.add_selected_to_encounter.bind(this);
        this.set_roll_MHP = this.set_roll_MHP.bind(this);
        this.add_player = this.add_player.bind(this);
        this.add_creature = this.add_creature.bind(this);
        this.copy_creatures = this.copy_creatures.bind(this);
        this.remove_creatures = this.remove_creatures.bind(this);
        this.change_sort = this.change_sort.bind(this);
        this.deselect_all = this.deselect_all.bind(this);
    }

    deselect_all(){
        const creature_list = this.props.encounter.creature_list;
        for (const player of creature_list.get_selected_players()){
            creature_list.players[player].select();
        }
        for (const non_player of creature_list.get_selected_non_players()){
            creature_list.non_players[non_player].select();
        }
    }

    add_to_encounter(name, creature){
        for (var i=0;i<creature.num;i++){
            this.props.encounter.add_creature(new EncounterCreature(name, creature, this.props.encounter, this.state.roll_MHP));
        }
    }

    add_selected_to_encounter(){
        const creature_list = this.props.encounter.creature_list;
        for (let player of creature_list.get_selected_players()){
            this.add_to_encounter(player, creature_list.players[player]);
            creature_list.players[player].select();
            creature_list.players[player].change_num(1);
        }
        for (let non_player of creature_list.get_selected_non_players()){
            this.add_to_encounter(non_player, creature_list.non_players[non_player]);
            creature_list.non_players[non_player].select();
            creature_list.non_players[non_player].change_num(1);
        }
        RenderFunctions.close_creature_list(this.props.creature_list, this.props.encounter);
    }

    set_roll_MHP(){
        this.setState({roll_MHP: !this.state.roll_MHP});
    }

    add_player(){
        this.deselect_all();
        const player_name = this.props.encounter.creature_list.add_player();
        this.props.encounter.creature_list.players[player_name].select();
        RenderFunctions.table_change(this.props.creature_list, this.props.encounter);
    }

    add_creature(){
        this.deselect_all();
        const creature_name = this.props.encounter.creature_list.add_non_player();
        this.props.encounter.creature_list.non_players[creature_name].select();
        RenderFunctions.table_change(this.props.creature_list, this.props.encounter);
    }

    copy_creatures(){
        this.props.encounter.creature_list.copy_selected();
        RenderFunctions.table_change(this.props.creature_list, this.props.encounter);
    }

    remove_creatures(){
        this.props.encounter.creature_list.remove_selected();
        RenderFunctions.table_change(this.props.creature_list, this.props.encounter);
    }

    change_sort(event){
        this.props.encounter.creature_list.set_non_players_sort(event.target.value);
        RenderFunctions.table_change(this.props.creature_list, this.props.encounter);
    }

    render(){
        return(
            <div>
                <button type="button" class="button_bar_button" onClick={this.add_selected_to_encounter}>Add to Encounter</button>
                <button type="button" class="button_bar_button" onClick={() => RenderFunctions.close_creature_list(this.props.creature_list, this.props.encounter)}>Cancel</button>
                <span class="button_bar_button">|</span>
                <button type="button" class="button_bar_button" onClick={this.set_roll_MHP}>Roll MHP: {(this.state.roll_MHP) ? <span>On/<span style={{color: "#aaaaaa"}}>Off</span></span> : <span><span style={{color: "#aaaaaa"}}>On</span>/Off</span>}</button>
                <span class="button_bar_button">|</span>
                <button type="button" class="button_bar_button" onClick={this.add_player}>Add Player</button>
                <button type="button" class="button_bar_button" onClick={this.add_creature}>Add Creature</button>
                <button type="button" class="button_bar_button" onClick={this.copy_creatures}>Copy</button>
                <button type="button" class="button_bar_button" onClick={this.remove_creatures}>Delete</button>
                <span class="button_bar_button">|</span>
                <span class="button_bar_button">Sort By:</span>
                <select class="button_bar_button" onChange={this.change_sort}>
        			<option value="AC">AC</option>
        			<option value="alignment">Alignment</option>
        			<option value="CHA">CHA</option>
        			<option value="CON">CON</option>
        			<option value="CR">CR</option>
        			<option value="DC">DC</option>
        			<option value="DEX">DEX</option>
        			<option value="EXP">EXP</option>
        			<option value="bonus">Init+</option>
        			<option value="INT">INT</option>
        			<option value="MHP">MHP</option>
        			<option value="name" selected>Name</option>
        			<option value="size">Size</option>
        			<option value="speed">Speed</option>
        			<option value="STR">STR</option>
        			<option value="type">Type</option>
        			<option value="WIS">WIS</option>
        		</select>
                <button type="button" class="button_bar_button right_float_button" onClick={() => RenderFunctions.toggle_headers(this.props.creature_list, this.props.encounter)}>{(document.getElementById("io_bar").style.display === "none") ? "\u25BD" : "\u25B3"}</button>
            </div>
        )
    }
}

export default CreatureButtonBar;