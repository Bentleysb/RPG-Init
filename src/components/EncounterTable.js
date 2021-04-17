import React from 'react';
import EncounterRow from './EncounterRow';
import Constants from './../Constants';

class EncounterTable extends React.Component{
    constructor(props){
        super(props);
        this.all_selected = this.all_selected.bind(this);
        this.select_all = this.select_all.bind(this);
    }

    all_selected(){
        const creatures = this.props.encounter.creatures;
        if (creatures.length < 1){
            return false;
        }
        for (const creature of creatures){
            if (!creature.selected){
                return false;
            }
        }
        return true;
    }

    select_all(){
        const all_selected = this.all_selected();
        for (const creature of this.props.encounter.creatures){
            if (creature.selected === all_selected){
                creature.select();
            }
        }
    }

    render(){
        return(
            <table class="creature_table">
                <tr class="creature_table">
                    <th class="creature_table">Init</th>
                    <th class="creature_table clickable" style={{backgroundColor: (this.all_selected()) ? Constants.selected_color : Constants.table_header_color}} onClick={this.select_all}>Name</th>
                    <th class="creature_table">Token</th>
                    <th class="creature_table">HP</th>
                    <th class="creature_table">AC</th>
                </tr>
                {this.props.encounter.creatures.map(creature => <EncounterRow encounter={this.props.encounter} creature={creature}/>)}
            </table>
        )
    }
}

export default EncounterTable;