
import { Component, Vue, Prop, Emit, PropSync } from "vue-property-decorator"
import { Getter, Action } from "vuex-class"
//import { QueryComonentData } from '@/types/views/queryComonent.interface'

@Component({
  name:"themeConfig"
})
export default class ThemeConfig extends Vue {

    @Prop({default:false}) private openThemeConf!: Boolean;
   
    get flage() {
        return this.openThemeConf
    }
    set flage(value) {
        this.$emit('close',value)
    }

    private themeSelect(event:any){
        let theme = event.currentTarget.getAttribute("name");
        localStorage.setItem('theme',theme);
        document.body.className = theme;
    }

}
