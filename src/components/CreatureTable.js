import React from 'react';
import Constants from './../Constants';
import CreatureRow from './CreatureRow';
import CreatureTableExtraColumns from './CreatureTableExtraColumns';

class CreatureTable extends React.Component{
    constructor(props){
        super(props);
        this.sort_key = this.sort_key.bind(this);
        this.all_selected = this.all_selected.bind(this);
        this.select_all = this.select_all.bind(this);
    }

    sort_key(){
        const key = this.props.creature_list.non_players_sort_key;
        if (key === "bonus"){
            return "Init+";
        }
        return key.charAt(0).toUpperCase()+key.substring(1);
    }

    all_selected(){
        const creature_count = Object.keys(this.props.creature_list.non_players).length;
        if (creature_count === 0){
            return false;
        }
        return this.props.creature_list.get_selected_non_players().length === creature_count;
    }

    select_all(){
        const all_selected = this.all_selected();
        for (const name in this.props.creature_list.non_players){
            const creature = this.props.creature_list.non_players[name];
            if (creature.selected === all_selected){
                creature.select();
            }
        }
    }

    render(){
        return(
            <table class="creature_table">
                <tr class="creature_table">
                    <th class="creature_table">#</th>
                    <th class="creature_table clickable" style={{backgroundColor: (this.all_selected()) ? Constants.selected_color : Constants.table_header_color}} onClick={this.select_all}>Name</th>
                    {this.sort_key() === "Name" ? null : <th class="creature_table">{this.sort_key()}</th>}
                </tr>
                {this.props.creature_list.get_sorted_non_players_keys().map(name => <CreatureRow name={name} creature={this.props.creature_list.non_players[name]} extra_columns={<CreatureTableExtraColumns creature={this.props.creature_list.non_players[name]} creature_list={this.props.creature_list} />}/>)}
            </table>
        )
    }
}

export default CreatureTable;