
import { Component, Vue, PropSync,  } from "vue-property-decorator"
import { GetSonSysetemList, GetSysMenuList } from "@/api/layout" 
import themeConfig from '@/types/components/drawerShadow/themeConfig.vue'

import { LayoutData } from '@/types/views/layout.interface'
import { Getter, Action } from "vuex-class"


@Component({
  name:"layoutI",
  components:{
    themeConfig
  }
})
export default class LayoutI extends Vue{

  bread: string[] = ['发行平台','首页'];
  isCollapsed :boolean = false; //菜单是否默认展开
  menuDefaultActive:string = '/cdk/index'; //定义菜单默认选中
  showIcon:boolean = false; //是否显示两边切换按钮
  tagListWidth:number = 0; //选项卡的总宽度
  moveWidth:number = 0; //当前平移的数
  openThemeConf:Boolean = false;  //配置主题


  /***子系统数据*/
  sonSystem = [];

  /**菜单选项卡数据**/
  tag = [
    {
      path:'/cdk/index',
      index:0,
      name:'首页'
    }
  ];

  
  /**主菜单数据**/
  menu = [
    {
      name:'首页',
      icon:"el-icon-location",
      path:'/cdk/index',
      children:[]
    },
    {
      name:"报表",
      icon:"el-icon-menu",
      path:'',
      children:[
        {
          name:"数据报表",
          path:"/cdk/report"
        },
        {
          name:"数据报表1",
          path:"/cdk/froma"
        },
        {
          name:"数据报表2",
          path:"/cdk/fromo"
        },
        {
          name:"数据报表3",
          path:"/cdk/fromt"
        },
      ]
    }
  ];
  
  created(){
    this.$router.push({name:'cdkIndex'}); //初始化路由跳转
    this.GetSonSysetemListData();  //初始化子系统数据
  }

  mounted(){
    
  }

  //获取所有子系统数据
  async GetSonSysetemListData(){
    (this.sonSystem as any) = await GetSonSysetemList({});
  }

  //获取子系统的菜单
  async GetMenuListData(menuId:Number){
    
    let data =  await GetSysMenuList({platformId:menuId});
  }

  //获取默认选中的系统菜单数据
  getDefultMenuList(){
    let active = document.getElementsByClassName('link__active')[0];
    let menuId = active.getAttribute('menuId');
  }

  //操作菜单折叠
  collapsedSider() {
    (this.$refs.sideHeader as HTMLFormElement).toggleCollapse();
  }

  //选项卡切换
  checked(index:number,event:any){
    let nodeName = event.target.nodeName;  //取点击元素的节点名。
    let parent = event.target.parentNode;  //取点击元素的父元素。div
    if(nodeName == "I"){
      this.$nextTick(()=>{
        this.tagListWidth = this.tagListWidth - parent.offsetWidth;
        let parentsW = parent.parentNode.offsetWidth;
        let pre = parent.previousElementSibling;
        // parent.parentNode.removeChild(parent);
        this.TagActive(pre.getAttribute("to"))
        this.$router.push(pre.getAttribute("to"))
        this.tag.splice(~~(parent.getAttribute("index")),1);
        this.menuDefaultActive = pre.getAttribute("to");
        if(this.tagListWidth < parentsW) {
          this.showIcon = false;
          (document.getElementsByClassName('tag_list')[0] as any).style.width = 'calc(100% - 28px)';
        }
      })
    }else if(nodeName == "DIV"){
      for(let i=0; i< event.target.parentNode.children.length; i++){
        if(i == index){
          event.target.parentNode.children[index].classList.add("c_tag__active");
        }else{
          event.target.parentNode.children[i].classList.remove("c_tag__active");
        }
      }
      this.$router.push(event.target.parentNode.children[index].getAttribute("to"));
      this.menuDefaultActive = event.target.parentNode.children[index].getAttribute("to");
    }else if(nodeName == "SPAN"){
      for(let i=0; i< parent.parentNode.children.length; i++){
        if(i == index){
          parent.parentNode.children[index].classList.add("c_tag__active");
        }else{
          parent.parentNode.children[i].classList.remove("c_tag__active");
        }
      }
      this.$router.push(parent.parentNode.children[index].getAttribute("to"));
      this.menuDefaultActive = parent.parentNode.children[index].getAttribute("to");
    }
  }

  //给选项卡加active样式
  TagActive(index:string){
    let tagActive = document.getElementsByClassName("tag_list")[0].children;
    this.$nextTick(()=>{
      for(let i=0; i< tagActive.length; i++){
        if(index === tagActive[i].getAttribute('to')){
          tagActive[i].classList.add("c_tag__active");
          if(i > (tagActive.length / 2)){
            this.ckRight();
          }else{
            this.ckLeft();
          }
        }else{
          tagActive[i].classList.remove("c_tag__active");
        }
      }
    })
  }

  //打开菜单
  openMenuItem(key:string, keyPath:any ,event:any):void {
    this.breadcrumbItem(event);
    this.menuDefaultActive = key;
    let hasTag = this.tag.filter((e:any) => e.path === key)
    if(hasTag.length === 0){
      let ref = this.$refs.menuTitle as HTMLFormElement;
      let menuName = ref.filter((el:any) => el.index == key)[0].$el.textContent;
      this.tag.push({
        name:menuName,
        path:key,
        index:this.tag[this.tag.length - 1].index + 1
      });
      this.$nextTick(()=>{
        let parentNW = (document.getElementsByClassName("tag_list")[0] as any).offsetWidth;
        let Width = 0, list = document.getElementsByClassName('tag_list')[0].children;
        for(let i = 0; i < list.length; i++){
          Width += ( (list[i] as any).offsetWidth + 4 );
        }
        if(Width > parentNW) {
          this.showIcon = true;
          this.tagListWidth = Width;
          (document.getElementsByClassName('tag_list')[0] as any).style.width = 'calc(100% - 90px)';
        }
        this.TagActive(key);
      })
    }else{
      this.TagActive(hasTag[0].path);
    }
  }

  //全局导航
  breadcrumbItem(event:any){
    let currentTarget = event.$el.innerText;
    let parents = event.$el.parentNode.previousSibling.innerText;
    if(event.$el.parentNode.getAttribute('role') === 'menubar'){
      this.bread = ['发行平台',currentTarget]
    }else{
      this.bread = ['发行平台',parents,currentTarget]
    }
    
  }

  //往左切换
  ckLeft(){
    let tagList = document.getElementsByClassName('c_tag');
    for(let i=0; i< tagList.length; i++){
      (tagList[i] as any).style.transform = `translateX(0px)`;
      (tagList[i] as any).style.transition = `all .3s ease-in-out`; //    transition: all .3s ease-in-out;
    }
  }

  //往右切换
  ckRight(){
    let tagParent = (document.getElementsByClassName('tag_list')[0] as any).offsetWidth;
    let tagList = document.getElementsByClassName('c_tag');
    for(let i=0; i< tagList.length; i++){
      (tagList[i] as any).style.transform = `translateX(-${this.tagListWidth - tagParent}px)`;
      (tagList[i] as any).style.transition = `all .3s ease-in-out`;
    }
  }

  //批量关闭选项卡
  closeTag(name:string){
    
      let index = Number(document.getElementsByClassName('c_tag__active')[0].getAttribute('index'));
      let key :any = document.getElementsByClassName('c_tag__active')[0].getAttribute('to');
      let length = this.tag.length;
      if(name == 'left'){
        this.tag.splice(1,index - 1);
        this.TagActive(key);
      }
      if(name == "right"){
        this.tag.splice(index + 1,length);
      }
      if(name == 'other'){
        this.tag.splice(1,index - 1);
        this.tag.splice(2,length);
        this.TagActive(key);
      }
      if(name == 'all'){
        this.tag.splice(1,length);
        this.TagActive('/cdk/index');
        this.$router.push('/cdk/index');
        this.menuDefaultActive = '/cdk/index';
      }
    this.$nextTick(() => {
      let parentsW = (document.getElementsByClassName('tag_list')[0] as any).offsetWidth;
      let Width = 0, list = document.getElementsByClassName('tag_list')[0].children;
      for(let i = 0; i < list.length; i++){
        Width += ( (list[i] as any).offsetWidth + 4 );
      }
      if(Width < parentsW) {
        this.showIcon = false;
        (document.getElementsByClassName('tag_list')[0] as any).style.width = 'calc(100% - 28px)';
      }
    })
  }


  //账号
  selectItem(name:string){
    if(name == "singOut"){  //退出
      this.$router.push({name:'login'});
      localStorage.removeItem('userName');
      localStorage.removeItem('passWord');
    }
  }

  //选择系统
  selectSetem(target:any){
    let _this = target.currentTarget;
    let parent = _this.parentNode.children;
    _this.classList.add('link__active');
    for(let i=0; i< parent.length; i++){
      if(parent[i].getAttribute('menuId') !== _this.getAttribute('menuId')){
        parent[i].classList.remove('link__active');
      }
    }
  }

  //打开配置主题抽屉
  openDrawer(type?: Boolean | undefined){
    if(typeof type === "boolean"){
      this.openThemeConf = false;
    }else{
      this.openThemeConf = true;
    }
  }

  get menuitemClasses() {
    return [
      'menuHeight',
      'menu-item',
      this.isCollapsed ? 'collapsed-menu' : ''
    ]
  };

  get rotateIcon () {
    return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
    ];
  };
  
}
