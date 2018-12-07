<template>
  <div>
    <div class="line_in1">
      <div class="h">请选择过滤条件</div>
      <div>
        <Input v-model="dimNameFilter" placeholder="搜索参数" style="width: 300px"/>
      </div>
    </div>

    <div v-if="arranging" class="arranging">
      <draggable v-if="true" v-model="editingDimCatList" :options="{group:'country'}"
              @end="catDragEnd($event, editingDimCatList)">
        <transition-group>
          <div class="dim-cat-part" v-for="(dimCat, idx) in editingDimCatList" v-bind:key="dimCat.value">
            <div class="dim-cat-name">
              <Icon type="ios-move" />
              <label-edit v-bind:text="dimCat.value" placeholder="(请输入分类名)"
                v-on:text-updated-blur="dimCat.value = $event"
                v-on:text-updated-enter="dimCat.value = $event"></label-edit>
              <Button class="remove-cat-button" v-if="dimCat.dimList.length == 0" @click="editingDimCatList.splice(idx, 1)">删除分类</Button>
            </div>
            <draggable v-if="true" class="dim-cat-value-part"  v-model="dimCat.dimList" :options="{group:'people'}"
                @end="dataDragEnd($event, dimCat)">
                  <transition-group>
                      <div v-for="item in dimCat.dimList" :key="item" class = "drag-item dim-cat-val">
                        <Icon type="ios-move" />
                        <a class="dim-item">{{item}}</a>
                      </div>
                  </transition-group>
            </draggable>
          </div>
        </transition-group>
      </draggable>
    </div> <!-- arranging -->

    <div v-if="!arranging" class="not-arranging">
      <div class="dim-cat-part" v-for="dimCat in dimCatList" v-bind:key="dimCat.value">
        <div class="dim-cat-name">{{dimCat.value}}：</div>
        <div class="dim-cat-value-part">
          <div
            class = "dim-cat-val"
            v-for="item in dimCat.dimList"
            v-if="item.indexOf(dimNameFilter.toLowerCase()) >= 0"
            v-bind:key="item">
            <a @click="dimClick(item)" class="dim-item">{{item}}</a>
          </div>
        </div>
      </div>
    </div> <!-- not arranging -->

    <div class="switch-to-arranging-line" v-if="!arranging"><Button @click="switchToArranging">整理参数</Button></div>

    <div v-if="arranging" class="control-line">
      <div class="add-cat">
        <Button @click="doAddCat">添加分类</Button>
      </div>
      <div class="save-cancel">
        <Button @click="doSave">保存</Button>
        <Button @click="doCancel">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import LabelEdit from 'vue-label-edit'

export default {
  name: 'FilterSelector',
  components: {
    draggable,
    LabelEdit
  },
  props: {
    dimCatList: Array,
    dimList: Array
  },
  data : function () {
    return {
      dimNameFilter: '',
      arranging: false,
      editingDimCatList: []
    }
  },
  methods: {
    dimClick: function (item) {
      console.log('clicked ' + item)
      this.$emit('dimClick', item)
    },
    switchToArranging () {
      // copy data
      this.editingDimCatList = JSON.parse(JSON.stringify(this.dimCatList))
      this.arranging = true
    },
    catDragEnd (evt, dimCat) {
      debugger
      evt.preventDefault()
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.dimCatList)
   },
    dataDragEnd (evt, dimCat) {
      debugger
      evt.preventDefault()
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.dimCatList)
   },
   doAddCat(){
     this.editingDimCatList.push({
       value: '新分类',
       dimList: []
     })
   },
   doSave () {
     this.$emit('updateDimCatList', this.editingDimCatList)
     this.arranging = false
   },
   doCancel () {
     this.arranging = false
   },
  //  textUpdateCallbackBlur(p1, p2){
  //    debugger
  //    console.log('blur')
  //  },
  //  textUpdateCallbackEnter(p1, p2){
  //    debugger
  //    console.log('enter')
  //  }
  },
  mounted () {
    // 参考https://blog.csdn.net/zhaoxiang66/article/details/81003094
    // 为了防止火狐浏览器拖拽的时候以新标签打开
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

}
</script>

<style scoped lang="less">
.line_in1 {
  display: flex;
  margin: 1em;
}
.dim-cat-part {
  display: inline-flex;
  width: 90%;
  margin-top: 0.5em;
  border-bottom-style: solid;
  padding-bottom: 0.5em;
  border-bottom-width: 1px;
}
.dim-cat-name {
  display: inline-box;
  flex-basis: 15em;
  // width: 20em;
  margin-top: 5px;
  // border-style: solid;
  text-align: right;
  flex-shrink: 0;
  align-items: center;
}
.dim-cat-value-part {
  display: flex;
  min-height: 1em;
  min-width: 10em;
  // border-style: solid;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex-basis: 90%;
}
// vuedraggable在这里会自动生成一个span，把它变大方便拖入
.dim-cat-value-part>span{
  min-height: 1em;
  min-width: 10em;
  padding-right: 10em;
  // border-style: solid;
}
.dim-cat-value-part a:hover {
  color: red;
}
.dim-cat-val {
  display: inline-block;
  flex-basis: 5%;
  border-style: solid;
  border-width: 1px;
  border-color: lightgray;
  margin-left: 1em;
  margin-top: 5px;
  text-align: center;
}
.arranging .dim-item {
  margin-left: 5px;
}
.arranging .dim-cat-val {
  cursor: move;
}
.arranging .dim-item:hover {
  cursor: move;
}
.arranging .dim-cat-name {
  display: flex;
}
.arranging .dim-cat-name {
  cursor: move;
}
.control-line {
  margin-top: 1em;
  display: flex;
  justify-content: space-between;
}

.save-cancel {
  margin-right: 15em;
}
.save-cancel button {
  margin-right: 2em;
}
.remove-cat-button {
  margin-left: 2em;
}
.switch-to-arranging-line {
  margin-top: 1em;
}
</style>
