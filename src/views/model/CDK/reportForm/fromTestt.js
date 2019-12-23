
import { Component, Vue } from "vue-property-decorator"
import { API__fromTestt_MethodName } from "@/api/model/CDK/reportForm" 
import globInit from '@/assets/plugin/globInit'


import { Getter, Action } from "vuex-class"
//import { FromTesttData } from '@/types/views/fromTestt.interface'

@Component({
  name:"fromTestt"
})
export default class FromTestt extends Vue {


  created(){
    //this.init(); 
  }
  mounted(){
    globInit.change()
  }
  //数据初始化
  async init(){
    let data = await API__fromTestt_MethodName({})
  }

}
