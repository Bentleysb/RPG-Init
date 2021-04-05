import './index.css';
import CreatureList from './creatures/CreatureList';
import Encounter from './encounters/Encounter';
import RenderFunctions from './RenderFunctions';

var c_list = new CreatureList();
var e_list = new Encounter();

var c_list_stored = localStorage.creature_list;
if (c_list_stored){
    c_list.from_json(JSON.parse(c_list_stored));
}

e_list.set_creature_list(c_list);

function set_stored_c_list(){
    localStorage.setItem("creature_list", JSON.stringify(c_list.to_json()));
}

window.onresize = function() {RenderFunctions.render_components(c_list, e_list)};

window.onscroll = () => RenderFunctions.sticky_button_bar_handler(c_list, e_list);

function arrow_press(e){
    if (document.getElementById("encounter_table").style.display !== 'none'){
        if (document.activeElement.tagName !== "TEXTAREA"){
            if (e.key === ("ArrowUp" || "Up") || e.keyCode === 38){
                e.preventDefault();
                e_list.up();
            }
            if (e.key === ("ArrowDown" || "Down" || e.keyCode === 40)){
                e.preventDefault();
                e_list.down();
            }
            if (e.key === ("Enter" || e.keyCode === 13)){
                e.preventDefault();
                e_list.unselect_all();
                e_list.down();
            }
            if (e.key === ("Escape" || e.keyCode === 27)){
                e.preventDefault();
                e_list.unselect_all();
            }
        }
    }
    else {
        if (e.key === ("Escape" || e.keyCode === 27)){
            e.preventDefault();
            c_list.unselect_all();
        }
    }
}

document.addEventListener("keydown", arrow_press, false);

document.addEventListener('creature_change_event', () => {
    set_stored_c_list(); 
    RenderFunctions.render_components(c_list, e_list);
});

RenderFunctions.render_components(c_list, e_list);