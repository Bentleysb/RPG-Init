import ReactDOM from 'react-dom';
import IoBar from './components/IoBar';
import EncounterTitle from './components/EncounterTitle';
import EncounterButtonBar from './components/EncounterButtonBar';
import EncounterTable from './components/EncounterTable';
import BlankCard from './components/BlankCard';
import EncounterCard from './components/EncounterCard';
import CreatureButtonBar from './components/CreatureButtonBar';
import PlayerTable from './components/PlayerTable';
import CreatureTable from './components/CreatureTable';
import CreatureCard from './components/CreatureCard';

class RenderFunctions{
    // Stick button bar variables
    static header;
    static sticky_origional;
    static sticky;
    static table_container;

    static open_creature_list(c_list, e_list){
        document.getElementById("encounter_button_bar").style.display = "none";
        document.getElementById("encounter_table").style.display = "none";
        document.getElementById("encounter_card").style.display = "none";
        document.getElementById("creature_button_bar").style.display = "block";
        document.getElementById("creature_tables").style.display = "inline-block";
        document.getElementById("creature_card").style.display = "block";
        RenderFunctions.table_change(c_list, e_list);
    }
    
    static close_creature_list(c_list, e_list){
        document.getElementById("encounter_button_bar").style.display = "block";
        document.getElementById("encounter_table").style.display = "inline-block";
        document.getElementById("encounter_card").style.display = "block";
        document.getElementById("creature_button_bar").style.display = "none";
        document.getElementById("creature_tables").style.display = "none";
        document.getElementById("creature_card").style.display = "none";
        RenderFunctions.table_change(c_list, e_list);
    }
    
    static table_change(c_list, e_list){
        RenderFunctions.render_components(c_list, e_list);
        setTimeout(RenderFunctions.render_components, 10, c_list, e_list);
    }

    static render_components(c_list, e_list){
        ReactDOM.render(<IoBar creature_list={c_list} encounter={e_list}/>, document.getElementById('io_bar'));
        ReactDOM.render(<EncounterTitle encounter={e_list}/>, document.getElementById('encounter_header'));
        ReactDOM.render(<EncounterButtonBar creature_list={c_list} encounter={e_list}/>, document.getElementById('encounter_button_bar'));
        ReactDOM.render(<EncounterTable encounter={e_list}/>, document.getElementById('encounter_table'));
        ReactDOM.render(<BlankCard content={<EncounterCard encounter={e_list}/>} left={parseFloat(document.getElementById("encounter_table").getBoundingClientRect().right)} top={parseInt(document.getElementById("encounter_button_bar").getBoundingClientRect().bottom)}/>, document.getElementById('encounter_card'));
        ReactDOM.render(<CreatureButtonBar creature_list={c_list} encounter={e_list}/>, document.getElementById('creature_button_bar'));
        ReactDOM.render(<PlayerTable creature_list={c_list}/>, document.getElementById('player_table'));
        ReactDOM.render(<CreatureTable creature_list={c_list}/>, document.getElementById('creature_table'));
        ReactDOM.render(<BlankCard content={<CreatureCard creature_list={c_list} encounter={e_list}/>} left={parseFloat(document.getElementById("creature_tables").getBoundingClientRect().right)} top={parseInt(document.getElementById("creature_button_bar").getBoundingClientRect().bottom)}/>, document.getElementById('creature_card'));
    }

    static sticky_button_bar_handler(c_list, e_list) {
        if (!RenderFunctions.header){
            RenderFunctions.header = document.getElementById("button_bar_container");
            RenderFunctions.sticky_origional = document.getElementById("button_bar_container").offsetTop;
            RenderFunctions.sticky = RenderFunctions.sticky_origional;
            RenderFunctions.table_container = document.getElementById("table_container");
        }
    
        if (window.pageYOffset > RenderFunctions.sticky) {
            RenderFunctions.header.classList.add("sticky");
            RenderFunctions.table_container.style.paddingTop = RenderFunctions.header.offsetHeight.toString()+"px";
        } else {
            RenderFunctions.header.classList.remove("sticky");
            RenderFunctions.table_container.classList.remove("sticky_padding");
            RenderFunctions.table_container.style.paddingTop = "0px";
        }
    
        RenderFunctions.render_components(c_list, e_list);
    }
    
    static set_headers_display(display, c_list, e_list){
        document.getElementById("io_bar").style.display = display;
        document.getElementById("encounter_header").style.display = display;
        RenderFunctions.render_components(c_list, e_list);
    }
    
    static toggle_headers(c_list, e_list){
        if (document.getElementById("io_bar").style.display === "none"){
            RenderFunctions.set_headers_display("block", c_list, e_list);
            RenderFunctions.sticky = RenderFunctions.sticky_origional;
        }
        else {
            RenderFunctions.set_headers_display("none", c_list, e_list);
            RenderFunctions.sticky = 0;
        }
    }

    static set_overlay_display(value){
        document.getElementById("loading_overlay").style.display = value;
    }
}

export default RenderFunctions;