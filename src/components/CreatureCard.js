import React from 'react';
import NpCreature from './../creatures/NpCreature';
import RenderFunctions from './../RenderFunctions';

class CreatureCard extends React.Component{
    constructor(props){
        super(props);
        this.get_creature_name = this.get_creature_name.bind(this);
        this.get_creature = this.get_creature.bind(this);
        this.set_name = this.set_name.bind(this);
        this.is_size = this.is_size.bind(this);
        this.set_size = this.set_size.bind(this);
        this.set_type = this.set_type.bind(this);
        this.set_alignment = this.set_alignment.bind(this);
        this.set_MHP = this.set_MHP.bind(this);
        this.get_MHP_avg = this.get_MHP_avg.bind(this);
        this.set_AC = this.set_AC.bind(this);
        this.set_DC = this.set_DC.bind(this);
        this.set_speed = this.set_speed.bind(this);
        this.set_bonus = this.set_bonus.bind(this);
        this.set_STR = this.set_STR.bind(this);
        this.set_DEX = this.set_DEX.bind(this);
        this.set_CON = this.set_CON.bind(this);
        this.set_INT = this.set_INT.bind(this);
        this.set_WIS = this.set_WIS.bind(this);
        this.set_CHA = this.set_CHA.bind(this);
        this.get_abilities = this.get_abilities.bind(this);
        this.set_abilities = this.set_abilities.bind(this);
        this.set_CR = this.set_CR.bind(this);
        this.set_EXP = this.set_EXP.bind(this);
        this.dont_display = this.dont_display.bind(this);
        this.get_stat = this.get_stat.bind(this);
        this.set_state_name = this.set_state_name.bind(this);
        this.name = 1;
    }

    dont_display(){
        return !(this.get_creature() instanceof NpCreature);
    }

    get_stat(stat){
        return this.dont_display() ? "" : this.get_creature()[stat];
    }

    get_creature_name(){
        const selected_players = this.props.creature_list.get_selected_players();
        const selected_creatures = this.props.creature_list.get_selected_non_players();
        if (selected_players.length+selected_creatures.length === 1){
            if (selected_players.length === 1){
                return selected_players[0];
            }
            else {
                return selected_creatures[0];
            }
        }
        return "";
    }

    get_creature(){
        const selected_players = this.props.creature_list.get_selected_players();
        const selected_creatures = this.props.creature_list.get_selected_non_players();
        if (selected_players.length+selected_creatures.length === 1){
            if (selected_players.length === 1){
                return this.props.creature_list.players[selected_players[0]];
            }
            else {
                return this.props.creature_list.non_players[selected_creatures[0]];
            }
        }
        return new NpCreature();
    }

    set_name(event){
        this.name = 1;
        const selected_players = this.props.creature_list.get_selected_players();
        const selected_creatures = this.props.creature_list.get_selected_non_players();
        if (selected_players.length+selected_creatures.length === 1){
            if (selected_players.length === 1 && !this.props.creature_list.players.hasOwnProperty(event.target.value)){
                this.props.creature_list.change_player_name(selected_players[0], event.target.value);
            }
            else if (selected_creatures.length === 1 && !this.props.creature_list.non_players.hasOwnProperty(event.target.value)) {
                this.props.creature_list.change_non_player_name(selected_creatures[0], event.target.value);
            }
        }
        RenderFunctions.table_change(this.props.creature_list, this.props.encounter);
    }

    set_state_name(event){
        this.name = event.target.value;
        RenderFunctions.render_components(this.props.creature_list, this.props.encounter);
    }

    is_size(option){
        if (this.get_creature().size === option){
            return "selected";
        }
        return "";
    }

    set_size(event){
        this.get_creature().set_stat("size", event.target.value);
    }

    set_type(event){
        this.get_creature().set_stat("type", event.target.value);
    }
    set_alignment(event){
        this.get_creature().set_stat("alignment", event.target.value);
    }

    set_MHP(event){
        this.get_creature().set_stat("MHP", event.target.value);
    }

    get_MHP_avg(){
        if (this.get_creature() instanceof NpCreature){
            const avg = this.get_creature().get_MHP_avg();
            if (avg !== this.get_creature().MHP){
                return "("+this.get_creature().get_MHP_avg()+")";
            }
        }
        return null;
    }

    set_AC(event){
        this.get_creature().set_stat("AC", event.target.value);
    }

    set_DC(event){
        this.get_creature().set_stat("DC", event.target.value);
    }

    set_speed(event){
        this.get_creature().set_stat("speed", event.target.value);
    }

    set_bonus(event){
        this.get_creature().set_stat("bonus", event.target.value);
    }

    set_STR(event){
        this.get_creature().set_stat("STR", event.target.value);
    }

    set_DEX(event){
        this.get_creature().set_stat("DEX", event.target.value);
    }

    set_CON(event){
        this.get_creature().set_stat("CON", event.target.value);
    }

    set_INT(event){
        this.get_creature().set_stat("INT", event.target.value);
    }

    set_WIS(event){
        this.get_creature().set_stat("WIS", event.target.value);
    }

    set_CHA(event){
        this.get_creature().set_stat("CHA", event.target.value);
    }

    get_abilities(){
        if ("atks" in this.get_creature()){
            return this.get_creature().atks.replace(/<br>/g,"\n").replace(/\u003C/g,"<").replace(/\u003E/g,">");
        }
        return "";
    }

    set_abilities(event){
        this.get_creature().set_stat("atks", event.target.value);
    }

    set_CR(event){
        this.get_creature().set_stat("CR", event.target.value);
    }

    set_EXP(event){
        this.get_creature().set_stat("EXP", event.target.value);
    }

    render(){
        return(
            <div class="card_container">
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">Name</th>
                        <th class="creature_table">Size</th>
                        <th class="creature_table">Type</th>
                        <th class="creature_table">Alignment</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><input type="text" size="20" class="card_input" value={this.name !== 1 ? this.name : this.get_creature_name()} onChange={this.set_state_name} onBlur={this.set_name}></input></td>
                        <td class="creature_table card_input"><select class="card_input_small" onChange={this.set_size} disabled={this.dont_display()}>
                            <option value="Other" selected={this.is_size("Other")}>Other</option>
                            <option value="Tiny" selected={this.is_size("Tiny")}>Tiny</option>
                            <option value="Small" selected={this.is_size("Small")}>Small</option>
                            <option value="Medium" selected={this.is_size("Medium")}>Medium</option>
                            <option value="Large" selected={this.is_size("Large")}>Large</option>
                            <option value="Huge" selected={this.is_size("Huge")}>Huge</option>
                            <option value="Gargantuan" selected={this.is_size("Gargantuan")}>Gargantuan</option>
                        </select></td>
                        <td class="creature_table card_input" disabled={this.dont_display()}><input type="text" size="13" class="card_input card_input_small" value={this.get_stat("type")} onChange={this.set_type} disabled={this.dont_display()}></input></td>
                        <td class="creature_table card_input" disabled={this.dont_display()}><input type="text" size="15" class="card_input card_input_small" value={this.get_stat("alignment")} onChange={this.set_alignment} disabled={this.dont_display()}></input></td>
                    </tr>
                </table>
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">MHP</th>
                        <th class="creature_table">AC</th>
                        <th class="creature_table">DC</th>
                        <th class="creature_table">Speed</th>
                        <th class="creature_table">Init+</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><input type="text" size="9" class="card_input" value={this.get_stat("MHP")} onChange={this.set_MHP} disabled={this.dont_display()}></input>{this.get_MHP_avg()}</td>
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_stat("AC")} onChange={this.set_AC} disabled={this.dont_display()}></input></td>
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_stat("DC")} onChange={this.set_DC} disabled={this.dont_display()}></input></td>
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_stat("speed")} onChange={this.set_speed} disabled={this.dont_display()}></input></td>
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_stat("bonus")} onChange={this.set_bonus} disabled={this.dont_display()}></input></td>
                    </tr>
                </table>
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">STR</th>
                        <th class="creature_table">DEX</th>
                        <th class="creature_table">CON</th>
                        <th class="creature_table">INT</th>
                        <th class="creature_table">WIS</th>
                        <th class="creature_table">CHA</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("STR")} onChange={this.set_STR} disabled={this.dont_display()}></input>{NpCreature.get_modifier(this.get_creature().STR)}</td>
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("DEX")} onChange={this.set_DEX} disabled={this.dont_display()}></input>{NpCreature.get_modifier(this.get_creature().DEX)}</td>
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("CON")} onChange={this.set_CON} disabled={this.dont_display()}></input>{NpCreature.get_modifier(this.get_creature().CON)}</td>
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("INT")} onChange={this.set_INT} disabled={this.dont_display()}></input>{NpCreature.get_modifier(this.get_creature().INT)}</td>
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("WIS")} onChange={this.set_WIS} disabled={this.dont_display()}></input>{NpCreature.get_modifier(this.get_creature().WIS)}</td>
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("CHA")} onChange={this.set_CHA} disabled={this.dont_display()}></input>{NpCreature.get_modifier(this.get_creature().CHA)}</td>
                    </tr>
                </table>
                <div class="card_table card_header abilities">Abilities</div>
                <div class="creature_table card_input abilities_container"><textarea rows="5" cols="5" class="card_input_small abilities" value={this.get_abilities()} onChange={this.set_abilities} disabled={this.dont_display()}></textarea></div>
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">CR</th>
                        <th class="creature_table">EXP</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_stat("CR")} onChange={this.set_CR} disabled={this.dont_display()}></input></td>
                        <td class="creature_table card_input"><input type="text" size="5" class="card_input" value={this.get_stat("EXP")} onChange={this.set_EXP} disabled={this.dont_display()}></input></td>
                    </tr>
                </table>
            </div>
        );
    }
}

export default CreatureCard;