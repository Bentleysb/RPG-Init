import React from 'react';
import CreatureRow from './CreatureRow';
import Constants from './../Constants';

class PlayerTable extends React.Component{
    constructor(props){
        super(props);
        this.all_selected = this.all_selected.bind(this);
        this.select_all = this.select_all.bind(this);
    }

    all_selected(){
        const player_count = Object.keys(this.props.creature_list.players).length;
        if (player_count === 0){
            return false;
        }
        return this.props.creature_list.get_selected_players().length === player_count;
    }

    select_all(){
        const all_selected = this.all_selected();
        for (const name in this.props.creature_list.players){
            const player = this.props.creature_list.players[name];
            if (player.selected === all_selected){
                player.select();
            }
        }
    }

    render(){
        return(
            <table class="creature_table">
                <tr class="creature_table">
                    <th class="creature_table">#</th>
                    <th class="creature_table clickable" style={{backgroundColor: (this.all_selected()) ? Constants.selected_color : Constants.table_header_color}} onClick={this.select_all}>Name</th>
                </tr>
                {this.props.creature_list.get_sorted_players_keys().map(name => <CreatureRow name={name} creature={this.props.creature_list.players[name]}/>)}
            </table>
        )
    }
}

export default PlayerTable;