
import { Component, Vue } from "vue-property-decorator"
import { API__ActivManage_getMethodName } from "@/api/model/CDK/activManage" 

import { Getter, Action } from "vuex-class"
//import { ActivManageData } from '@/types/views/activManage.interface'

@Component({
  name:"activManage"
})
export default class ActivManage extends Vue {
  

  created(){
    this.init(); 
  }

  //数据初始化
  async init(){
    let data = await API__ActivManage_getMethodName({})
  }

}
