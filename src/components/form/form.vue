<template>
<div>
<Form v-if="functions==='add'">
  <formItem>
      请选择要添加的类型:
        <RadioGroup v-model="type">
           <!-- <Radio label='product'/> -->
           <Radio v-if="model.type==='product'||model.type==='folder'"label='folder'/>
           <Radio v-if="model.type==='folder'"label='direct-link'/>
           <Radio v-if="model.type==='folder'"label='args-script'/>
        </RadioGroup>
        <br/>
        <Input v-model.trim="itemName" placeholder="请输入要添加的名称..." style="width: 300px" />
      <div v-if="type" style="color:green">
        您当前选择了:{{this.type}}&nbsp;,&nbsp;parentId:{{model.id}}&nbsp;,&nbsp;itemName:{{this.itemName}}
      </div>
      <br/>
    <Button v-if="allow===false" @click="save()"type="primary">保存</Button>
    <div v-if ="allow===false" style="color:red">{{this.success}}</div>
    <div v-if ="allow===true" style="color:green">{{this.success}}</div>
  </formItem>
</Form>
<Form v-if="functions==='addProduct'">
  <formItem>
    请输入要添加的新产品名称：<input v-model.trim="productName"/>
  </formItem>
  <formItem>
    <Button type="primary" v-if="allow===false" @click="save()">添加产品</Button>
    <div v-if ="allow===false" style="color:red">{{this.success}}</div>
    <div v-if ="allow===true" style="color:green">{{this.success}}</div>
  </formItem>
</Form>
<Form v-if="functions==='rename'">
  <formItem>
      原名称:{{model.title}}<br/>
        <Input v-model.trim="itemName" placeholder="请输入要更改的新的名称..." style="width: 300px" />
      <br/>
    <Button v-if="allow===false" @click="rename()"type="primary">更改</Button>
    <div v-if ="allow===false" style="color:red">{{this.success}}</div>
    <div v-if ="allow===true" style="color:green">{{this.success}}</div>
  </formItem>
</Form>
<Form v-if="functions==='delete'">
  <formItem>
   确定要删除【{{model.title}}】吗？
    <Button v-if="allow===false" @click="deletes()"type="primary">确定</Button>
  </formItem>
</Form>
<Form v-if="functions==='move'">
  <formItem>
    <br/>
    1.当前选择了：{{model.title}}<br/>
    2.要移动到:<div style="color:orange">(请点击上方按钮来选择目标folder或者product)</div>
    <div style="color:green">{{this.selected.title}}</div>
    <div style="color:red" v-if="this.selected.type!=='product'&&this.selected.type!=='folder'">（不能移动到叶子节点下面）</div>
    <br/>
    <Button v-if="allow===false" @click="moves()"type="primary">移动</Button>
  </formItem>
</Form>
<Form v-if="functions==='copy'">
  <formItem>
    1.要复制的叶子节点:{{model.title}}
    <br/>
    2.请选择要复制到哪一项下面：<div style="color:orange">(请点击上方按钮来选择目标folder或者product)</div>
    <br/>
    复制到哪里：<div style="color:green">{{selected.title}}</div>
    <div style="color:red" v-if="this.selected.type!=='product'&&this.selected.type!=='folder'">（不能复制到叶子节点下面）</div>
    <br/>
    <Button v-if="allow===false" @click="copys()"type="primary">复制</Button>
  </formItem>
</Form>
<Form v-if="functions==='setPerms'">
  <formItem>
    {{model.title}}的权限:<div v-for="item in this.perms"><div >{{item.value}}:{{item.perms}}</div></div>
    
    <Button @click="setPerms()"type="primary">设置</Button>
  </formItem>
</Form>
<Form v-if="functions==='setAttrs'">
  <formItem>
    {{model.title}}的属性:<div v-for="item in this.attrs">{{item.title}}:{{item.attrVal}}</div>
  </formItem>
  <formItem>
    <!-- 设置当前属性的类型为：
    <RadioGroup v-model="Nowtype">
      <Radio label='direct-link'/>
      <Radio label='args-script'/>
    </RadioGroup> -->
    <Input v-if="model.type === 'direct-link'" placeholder="请输入要添加的URL..." v-model.trim="urls" />
    <div v-if="model.type === 'args-script'">
      脚本id：<Input placeholder="请输入要添加的脚本id..." v-model.trim="scriptid" style="width: 300px"/><br/>
      参数名1：<Input placeholder="请输入要添加的脚本参数名1..." v-model.trim="param_a" style="width: 300px"/>参数值1：<Input placeholder="请输入要添加的脚本参数值1..." v-model.trim="param_a_value" style="width: 300px" /><br/>
      参数名2：<Input placeholder="请输入要添加的脚本参数名2..." v-model.trim="param_b" style="width: 300px"/>参数值2：<Input placeholder="请输入要添加的脚本参数值2..." v-model.trim="param_b_value" style="width: 300px"/>
    </div>
    <Button type="primary" @click="setAttrs()">保存</Button>
  </formItem>
</Form>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import axios from 'axios'
export default {
    props:['model','functions','selected','perms','attrs'],
    data(){
      return{
        type:'',
        itemName:'',
        success:'',
        productName:'',
        urls:'',
        scriptid:'',
        param_a:'',
        param_b:'',
        param_a_value:'',
        param_b_value:''
      }
    },
    computed: {
      ...mapState({
      allow: "allow"
    })
    },
    methods:{
      save(){
        if(this.productName !==null&&this.productName!==''){
           axios.request({
              url: '/api/data-tree/edit/add',
              method: 'post',
              data:{
                  parentId:-1,
                  type:'product',
                  title:this.productName
              }
              }).then(res => {
              //this.$Message.info('新增项的id：'+res.data.id);//测试用
              // if(res.data.status === 'error'){
              //   this.$store.commit('updateAllow',{status:false});
              //   this.$Message.info(res.data.msg);
              //   this.success='添加失败';
              // }else{
                 this.$Message.info('添加成功');
                 // this.$Message.info(res.data.id);
                 this.success='已添加';
                 this.$store.commit('updateAllow',{status:true});
                 this.$store.dispatch('reloadDataTree')//完成后会从新加载数据
              //}
                            })
        }else{
        if(this.type===''||(this.itemName===''||this.itemName.length===0)){
            this.$Message.info('未选择类型或输入的名称为空');
            this.success='未选择类型或输入的名称为空';
            this.$store.commit('updateAllow',{status:false});
        }else{
         axios.request({
              url: '/api/data-tree/edit/add',
              method: 'post',
              data:{
                  parentId:this.model.id,
                  type:this.type,
                  title:this.itemName
              }
              }).then(res => {
              //this.$Message.info('新增项的id：'+res.data.id);//测试用
              // if(res.data.status === 'error'){
              //   this.$store.commit('updateAllow',{status:false});
              //   this.$Message.info(res.data.msg);
              //   this.success='添加失败';
              // }else{
                 this.$Message.info('添加成功'+'id:'+res.data.id);
                 // this.$Message.info(res.data.id);
                 this.success='已添加';
                 this.$store.commit('updateAllow',{status:true});
                 this.$store.dispatch('reloadDataTree')//完成后会从新加载数据
              //}
                            })
         }
         }
      },
      rename(){
            if(this.itemName===''||this.itemName.length===0){
            this.$Message.info('输入的名称为空');
            this.success='输入的名称为空';
            this.$store.commit('updateAllow',{status:false});
            }else{
             axios.request({
              url: '/api/data-tree/edit/rename',
              method: 'post',
              data:{
                  id:this.model.id,
                  title:this.itemName
              }
              }).then(res => {
              // if(res.data.isRenamed === true){
                    this.$Message.info('修改成功');
                    this.success='已修改';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
              // }else{
              //   this.$store.commit('updateAllow',{status:false});
              //   this.$Message.info('修改失败');
              //   this.success='修改失败';
              // }
                            })
            }
      },
      deletes(){
         axios.request({
              url: '/api/data-tree/edit/delete',
              method: 'post',
              data:{
                  id:this.model.id
              }
              }).then(res => {
              //  if(res.data.msg === null){
                    this.$Message.info('删除成功');
                    this.success='删除成功';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
              // }else{
              //   this.$store.commit('updateAllow',{status:false});
              //   this.$Message.info(res.data.msg);
              //   this.success=res.data.msg;
              // }
                            })
      },
      moves(){
        if(this.model.type !== 'product'){
          axios.request({
              url: '/api/data-tree/edit/move',
              method: 'post',
              data:{
                  id:this.model.id,
                  parentId:this.selected.id
              }
              }).then(res => {
                    this.$Message.info('移动成功');
                    this.success='移动成功';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
                            })
        }
      },
      copys(){
          if(this.model.type !== 'product'&&this.model.type !== 'folder'){
          axios.request({
              url: '/api/data-tree/edit/copy',
              method: 'post',
              data:{
                  id:this.model.id,
                  parentId:this.selected.id
              }
              }).then(res => {
                    this.$Message.info('复制成功');
                    this.success='复制成功';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
                            })
        }
      },
      setPerms(){
            axios.request({
              url: '/api/data-tree/edit/set-perms',
              method: 'post',
              data:{
                  id:this.model.id,
                  permList:{'value':'','perms':''}
              }
              }).then(res => {
                    this.$Message.info('设置成功');
                    this.success='设置成功';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
                            })
      },
      setAttrs(){
        var attr={};
        if(this.model.type === 'direct-link'){
          var attr1={'attrKey':'linkUrl','attrVal':this.urls};
            attr=attr1;
        }else{
            var param_a=this.param_a
            var param_b=this.param_b
            var attrVal={param_a:this.param_a_value,param_b:this.param_b_value};
            var attr2=[{'attrKey':'scriptId','attrVal':this.scriptid},{'attrKey':'scriptParams','attrVal':attrVal}];
            attr=attr2;
        }
        for(var i=0;i<attr.length;i++){
              axios.request({
              url: '/api/data-tree/edit/set-attrs',
              method: 'post',
              data:{
                  id:this.model.id,
                  attrs:attr[i]
              }
              }).then(res => {
                    this.$Message.info('修改成功');
                    this.success='修改成功';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
                            })
        }
      }
    }
}
</script>


