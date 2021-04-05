import React from 'react';
import RenderFunctions from './../RenderFunctions';

class EncounterButtonBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {crit_init: true};
        this.remove_creatures = this.remove_creatures.bind(this);
        this.set_crit = this.set_crit.bind(this);
        this.roll_init = this.roll_init.bind(this);
        this.sort_creatures = this.sort_creatures.bind(this);
        this.kill_selected = this.kill_selected.bind(this);
    }

    remove_creatures(){
        this.props.encounter.remove_selected();
        RenderFunctions.table_change(this.props.creature_list, this.props.encounter);
    }

    set_crit(){
        this.setState({crit_init: !this.state.crit_init});
    }

    roll_init(){
        this.props.encounter.roll_np_creatures_init(this.state.crit_init);
    }

    sort_creatures(){
        this.props.encounter.sort_creatures();
    }

    kill_selected(){
        this.props.encounter.kill_selected();
    }

    render(){
        return(
            <div>
                <button type="button" class="button_bar_button" onClick={() => RenderFunctions.open_creature_list(this.props.creature_list, this.props.encounter)}>Creature List</button>
                <button type="button" class="button_bar_button" onClick={this.remove_creatures}>Remove</button>
                <span class="button_bar_button">|</span>
                <button type="button" class="button_bar_button" onClick={this.set_crit}>Crit Init: {(this.state.crit_init) ? <span>On/<span style={{color: "#aaaaaa"}}>Off</span></span> : <span><span style={{color: "#aaaaaa"}}>On</span>/Off</span>}</button>
                <button type="button" class="button_bar_button" onClick={this.roll_init}>Roll</button>
                <button type="button" class="button_bar_button" onClick={this.sort_creatures}>Sort</button>
                <button type="button" class="button_bar_button" style={{marginRight: "3px"}} onClick={() => this.props.encounter.up()}>{"\u25B2"}</button>
                <button type="button" class="button_bar_button" onClick={() => this.props.encounter.down()}>{"\u25BC"}</button>
                <button type="button" class="button_bar_button" onClick={this.kill_selected}>Kill</button>
                <button type="button" class="button_bar_button right_float_button" onClick={() => RenderFunctions.toggle_headers(this.props.creature_list, this.props.encounter)}>{(document.getElementById("io_bar").style.display === "none") ? "\u25BD" : "\u25B3"}</button>
            </div>
        )
    }
}

export default EncounterButtonBar;