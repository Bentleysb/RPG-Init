import React from 'react';
import Constants from './../Constants';

class CreatureRow extends React.Component{
    constructor(props){
        super(props);
        this.get_row_color = this.get_row_color.bind(this);
        this.set_num = this.set_num.bind(this);
        this.select = this.select.bind(this);
    }

    get_row_color(){
        if (this.props.creature.selected){
            return Constants.selected_color;
        }
        else {
            return Constants.creature_table_color;
        }
    }

    set_num(event){
        this.props.creature.change_num(event.target.value)
    }

    select(){
        this.props.creature.select();
    }

    render(){
        return(
            <tr class="creatre_table" style={{backgroundColor: this.get_row_color()}}>
                <td class="creature_table"><input type="text" size="1" value={this.props.creature.num} onChange={this.set_num}></input></td>
                <td class="creature_table clickable" onClick={this.select}>{this.props.name}</td>
                {this.props.extra_columns}
            </tr>
        )
    }
}

export default CreatureRow;