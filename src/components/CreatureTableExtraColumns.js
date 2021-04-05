import React from 'react';

class CreatureTableExtraColumns extends React.Component{
    render(){
        return(
            [
                this.props.creature_list.non_players_sort_key === "name" ? null : <td class="creature_table">{this.props.creature[this.props.creature_list.non_players_sort_key]}</td>
            ]
        );
    }
}

export default CreatureTableExtraColumns;