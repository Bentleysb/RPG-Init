
import React from 'react';
import RenderFunctions from './../RenderFunctions';

class IoBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {load: true, encounter_file: "unnamed_encounter.json", creature_file: "creature_list.json"};
        this.set_load = this.set_load.bind(this);
        this.load_creatures = this.load_creatures.bind(this);
        this.load_encounter = this.load_encounter.bind(this);
        this.set_encounter_file = this.set_encounter_file.bind(this);
        this.set_creature_file = this.set_creature_file.bind(this);
        this.download_file = this.download_file.bind(this);
        this.open_new_instance = this.open_new_instance.bind(this);
    }

    set_load(){
        this.setState({load: !this.state.load});
    }

    load_creatures(event){
        RenderFunctions.set_overlay_display("block");
        const creature_list = this.props.creature_list;
        const encounter = this.props.encounter;
        const reader = new FileReader();
        reader.onload = function(props){
            creature_list.from_json(JSON.parse(reader.result));
            encounter.set_creature_list(creature_list);
            RenderFunctions.set_overlay_display("none");
        };
        try {
            reader.readAsText(event.target.files[0]);
        }
        catch (e){
            RenderFunctions.set_overlay_display("none");
        }
    }

    load_encounter(event){
        RenderFunctions.set_overlay_display("block");
        const encounter = this.props.encounter;
        const reader = new FileReader();
        reader.onload = function(){
            encounter.from_json(JSON.parse(reader.result));
            RenderFunctions.set_overlay_display("none");
        };
        reader.readAsText(event.target.files[0]);
    }

    set_encounter_file(event){
        this.setState({encounter_file: event.target.value});
    }

    set_creature_file(event){
        this.setState({creature_file: event.target.value});
    }

    download_file(name, contents_object){
        if (name.search(".json") === -1){
            name += ".json"
        }
        var contents = JSON.stringify(contents_object)
        var mime_type = "text/octet-stream";
        if (window.navigator.msSaveOrOpenBlob){
            var blob = new Blob([contents], {type: mime_type});
            window.navigator.msSaveOrOpenBlob(blob, name);
        } else {
            var dlink = document.createElement('a');
            dlink.download = name;
            dlink.href = "data:"+mime_type+","+encodeURI(contents);
            document.body.appendChild(dlink);
            dlink.click();
            dlink.remove();
        }
    }

    open_new_instance(){
        window.open(window.location.href, "_blank");
    }

    render(){
        return(
            <div>
                <button id="save_switch" type="button" class="io_bar_button" onClick={this.set_load}>{this.state.load ? "Save" : "Load"}</button>
                <span class="button_bar_text">Creature List: </span>
                {this.state.load ?
        		<input type="file" accept=".json" class="io_bar_button" onChange={this.load_creatures}/>
                : <span>
                <input type="text" size="30" class="button_bar_text" value={this.state.creature_file} onChange={this.set_creature_file}></input>
                <button class="io_bar_button" onClick={function(){this.download_file(this.state.creature_file, this.props.creature_list.to_json())}.bind(this)}>Download</button>
                </span>}
                <span class="button_bar_text">Encounter: </span>
                {this.state.load ?
        		<input type="file" accept=".json" class="io_bar_button" onChange={this.load_encounter}/>
                : <span>
                    <input type="text" size="30" class="button_bar_text" value={this.state.encounter_file} onChange={this.set_encounter_file}></input>
                    <button class="io_bar_button" onClick={function(){this.download_file(this.state.encounter_file, this.props.encounter.to_json())}.bind(this)}>Download</button>
                </span>}
                <button type="button" class="button_bar_button right_float_button" onClick={this.open_new_instance}>+</button>
            </div>
        )
    }
}

export default IoBar;