import React from 'react';

class BlankCard extends React.Component{
    constructor(props){
        super(props);
        this.card_position = this.card_position.bind(this);
    }

    card_position(){
        return {
            left: (this.props.left+10+window.innerWidth/10).toString()+"px",
            top: (this.props.top+10).toString()+"px",
            right: "10px",
            bottom: "10px"
        };
    }

    render(){
        return(
            <div class="blank_card" style={this.card_position()}>
                {this.props.content}
            </div>
        )
    }
}

export default BlankCard;