import React from 'react';
import Creature from '../creatures/Creature';
import EncounterCreature from '../encounters/EncounterCreature';
import NpCreature from './../creatures/NpCreature';
import Encounter from './../encounters/Encounter';

class EncounterCard extends React.Component{
    constructor(props){
        super(props);
        this.get_creature = this.get_creature.bind(this);
        this.get_header = this.get_header.bind(this);
        this.get_notes_color = this.get_notes_color.bind(this);
        this.set_hp = this.set_hp.bind(this);
        this.set_notes = this.set_notes.bind(this);
        this.abilities_style = this.abilities_style.bind(this);
    }

    get_creature(){
        const encounter = this.props.encounter;
        const selected = encounter.get_selected();
        if (selected.length === 1){
            return encounter.creatures[selected[0]];
        }
        else if (selected.length < 1 && encounter.creatures.length > 0){
            return encounter.creatures[encounter.active_turn];
        }
        else {
            return new EncounterCreature("", new Encounter(), new Creature());
        }
    }

    get_header(){
        const creature = this.get_creature();
        if (creature.creature instanceof NpCreature){
            return (
                <span>
                    {creature.name}
                    :{"\u00A0\u00A0\u00A0\u00A0"}
                    <span style={{fontSize: "12pt"}}>
                        {creature.creature.size}{"\u00A0"}
                        {creature.creature.type},{"\u00A0"}
                        {creature.creature.alignment}
                    </span>
                </span>
            )
        }
        else {
            return creature.name;
        }
    }

    get_notes_color(){
        const encounter = this.props.encounter;
        const notes = this.get_creature().notes;
        const round_exps = notes.match(/r{\d+}/g);
        if (round_exps){
            for (const round_exp of round_exps){
                if (round_exp.match(/\d+/g)[0] === encounter.round.toString()){
                    return "red";
                }
            }
        }
        return "grey";
    }

    set_hp(event){
        this.get_creature().set_HP(event.target.value);
    }

    set_notes(event){
        this.get_creature().set_notes(event.target.value);
    }

    abilities_style(){
        const header = document.getElementById("abilities_header");
        const notes = document.getElementById("notes");
        if (header && notes){
            return {height: (parseFloat(notes.getBoundingClientRect().top)-parseFloat(header.getBoundingClientRect().bottom)-10).toString()+"px"}
        }
        return {}
    }

    render(){
        return (
            <div class="card_container">
                <div class="card_header encounter_card_header card_table">{this.get_header()}</div>
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">HP/MHP</th>
                        <th class="creature_table">AC</th>
                        <th class="creature_table">DC</th>
                        <th class="creature_table">Speed</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_creature().HP} onChange={this.set_hp}></input> ({this.get_creature().MHP})</td>
                        <td class="creature_table card_input">{this.get_creature().creature.AC}</td>
                        <td class="creature_table card_input">{this.get_creature().creature.DC}</td>
                        <td class="creature_table card_input">{this.get_creature().creature.speed}</td>
                    </tr>
                </table>
                <table id="e_scores" class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">STR</th>
                        <th class="creature_table">DEX</th>
                        <th class="creature_table">CON</th>
                        <th class="creature_table">INT</th>
                        <th class="creature_table">WIS</th>
                        <th class="creature_table">CHA</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.STR}</span>{NpCreature.get_modifier(this.get_creature().creature.STR)}</td>
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.DEX}</span>{NpCreature.get_modifier(this.get_creature().creature.DEX)}</td>
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.CON}</span>{NpCreature.get_modifier(this.get_creature().creature.CON)}</td>
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.INT}</span>{NpCreature.get_modifier(this.get_creature().creature.INT)}</td>
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.WIS}</span>{NpCreature.get_modifier(this.get_creature().creature.WIS)}</td>
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.CHA}</span>{NpCreature.get_modifier(this.get_creature().creature.CHA)}</td>
                    </tr>
                </table>
                <div class="card_table card_header abilities">Abilities</div>
                <p class="abilities">{this.get_creature().creature.atks}</p>
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table" style={{backgroundColor: this.get_notes_color()}}>Notes</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><textarea rows="5" cols="5" class="notes" value={this.get_creature().notes} onChange={this.set_notes}></textarea></td>
                    </tr>
                </table>
            </div>
        )
    }
}

export default EncounterCard;