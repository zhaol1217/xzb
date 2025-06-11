<template>
  <div style="display: flex;justify-content: space-around">
    <div style="width: 640px" v-show="showVisible">
      <el-input v-model="price" placeholder="请输入价格" />
      <el-button-group>
        <el-button style="width: 161px" @click="showDialog(0)">添加分类</el-button>
        <el-button style="width: 160px" @click="deleteKind">删除分类</el-button>
        <el-select
            v-model="selectKind"
            placeholder="Select"
            style="width: 320px"
            @change="getFilteredFoodList"
        >
          <el-option
              v-for="item in foodMenu"
              :key="item.kind"
              :label="item.kind"
              :value="item.kind"
          />
        </el-select>
      </el-button-group>

      <el-button-group>
        <el-button style="width: 161px" @click="showDialog(2)">导入数据</el-button>
        <el-button style="width: 160px" @click="exportData">导出数据</el-button>
        <el-button style="width: 161px" @click="showDialog(1)">添加菜品</el-button>
        <el-button style="width: 161px" @click="leftData=[];rightData=[]">清空右侧</el-button>
      </el-button-group>
      <el-table :data="filterItem==''?foodTable:foodTable?.filter(el=>el.name.indexOf(filterItem)>=0)"
                style="width: 100%;height: 800px" border>
        <el-table-column type="selection" width="60" />
        <el-table-column prop="name" width="260" label="菜名">
          <template #header>
            <el-input v-model="filterItem"></el-input>
          </template>
          <template #default="scope">
            <span>{{scope.row.name}}</span>
            <span style="color: orange" v-if="leftData.filter(el=>el.name===scope.row.name).length">（左侧）</span>
            <span style="color: orange" v-if="rightData.filter(el=>el.name===scope.row.name).length">（右侧）</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
                link
                type="danger"
                size="small"
                @click.prevent="deleteRow(scope.row)"
            >
              删除
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                @click.prevent="left(scope.row)"
            >
              放入左侧
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                @click.prevent="right(scope.row)"
            >
              放入右侧
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--新增分类-->
      <el-dialog v-model="kindDialog" :title="type" width="30%" draggable>
        <el-input v-model="selectItem" placeholder="请输入分类名称" />
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="confirmKind">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!--新增蔡明-->
      <el-dialog v-model="nameDialog" :title="type" width="30%" draggable>
        <el-input v-model="selectItem" placeholder="请输入菜品名称" />
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="confirmName">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!--导入菜单-->
      <el-dialog v-model="importDialog" :title="type" width="30%" draggable>
        <el-input v-model="selectItem" placeholder="此处输入导入的内容" />
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="importData">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <!--右侧菜单组件-->
    <Show @update:show-visible="updateShow"
          @update:delete-left="deleteLeft"
          @update:delete-right="deleteRight"
          :show-visible="showVisible"
          :price="price"
          :left-data="leftData"
          :right-data="rightData"
    >
    </Show>
  </div>
</template>

<script setup lang="ts">
  import Show from "./Show.vue";
  import {onMounted, ref, watch} from "vue";
  import {ElMessage} from "element-plus";
  import useClipboard from "vue-clipboard3";
  const {toClipboard} = useClipboard();

  //菜单列表
  const foodMenu = ref<FoodMenu[]>([])
  const foodTable = ref<FoodDetail[]>()
  //筛选框
  const filterItem = ref<string>('')

  //通用输入框
  const selectItem = ref<string>('')

  //价格
  const price = ref<number>(1200)

  //选择分类
  const selectKind = ref<string>()

  //根据分类筛选菜单
  const getFilteredFoodList=()=> {
    foodTable.value = []
    for (let i = 0; i < foodMenu.value.length; i++) {
      if (foodMenu.value[i].kind === selectKind.value){
        foodTable.value = foodMenu.value[i].foodList
      }
    }
  }

  //弹窗类型
  const type = ref<string>('')

  //弹窗开关
  const showVisible = ref<boolean>(true)
  const kindDialog = ref<boolean>(false)
  const nameDialog = ref<boolean>(false)
  const importDialog = ref<boolean>(false)

  //显示弹窗
  const updateShow = (show:boolean)=>{
    showVisible.value = show
  }

  //显示弹窗
  const showDialog = (value:number)=>{
    selectItem.value = ''
    if (value==0){
      type.value = '新增分类'
      kindDialog.value = true
    }
    if (value == 1){
      if (!selectKind.value){
        ElMessage.warning('请先选择分类')
        return
      }
      type.value = '新增菜品'
      nameDialog.value = true
    }
    if (value == 2){
      type.value = '导入菜单'
      importDialog.value = true
    }
  }


  //添加分类
  const confirmKind = ()=>{
    if (foodMenu.value.filter(el=>el.kind===selectItem.value).length>0){
      ElMessage.warning('已经有这个分类了！')
      return
    }
    foodMenu.value.push({kind:selectItem.value,foodList:[]})
    ElMessage.success('新增成功')
    kindDialog.value = false;
  }
  //删除分类
  const deleteKind = ()=>{
    if (!selectKind.value){
      ElMessage.warning('请先选择分类！')
      return
    }
    for (let i = 0; i < foodMenu.value.length; i++) {
      if (foodMenu.value[i].kind === selectKind.value){
        foodMenu.value.splice(i,1)
      }
    }
    selectKind.value = ''
    foodTable.value = []
    ElMessage.success("删除成功！")
  }

  //添加菜名
  const confirmName = ()=>{
    if (!foodTable.value){
      foodTable.value = []
    }
    if (foodTable.value.filter(el=>el.name===selectItem.value).length>0){
      ElMessage.warning('这个分类已经有这个菜品了！')
      return
    }
    foodTable.value.push({name:selectItem.value})
    ElMessage.success('新增成功')
    nameDialog.value = false;
  }

  //删除菜名
  const deleteRow = (value:FoodDetail)=>{
    foodTable.value?.splice(foodTable.value?.indexOf(value),1)
  }



  //左侧数据
  const leftData = ref<FoodDetail[]>([])
  //右侧数据
  const rightData = ref<FoodDetail[]>([])

  //添加左侧数据
  const left = (value:FoodDetail)=>{
    if (foodTable.value){
      leftData.value.push(value)
    }
  }

  //删除左侧数据
  const deleteLeft = (index:number)=>{
    leftData.value.splice(index,1)
  }

  //添加右侧数据
  const right = (value:FoodDetail)=>{
    if (foodTable.value){
      rightData.value.push(value)
    }
  }

  //删除右侧数据
  const deleteRight = (index:number)=>{
    rightData.value.splice(index,1)
  }

  //导入数据
  const importData = ()=>{
    try{
      let array = JSON.parse(selectItem.value);
      if (!Array.isArray(array)){
        ElMessage.warning("格式错误")
        return
      }
      for (let i = 0; i < array.length; i++) {
        if(foodMenu.value.filter(el=>el.kind === array[i].kind).length<=0){
          foodMenu.value.push({kind:array[i].kind,foodList:[]})
        }
        for (let j = 0; j < foodMenu.value.length; j++) {
          if (foodMenu.value[j].kind === array[i].kind) {
            const existingNames = new Set(foodMenu.value[j].foodList.map(item => item.name));
            for (let k = 0; k < array[i].foodList.length; k++) {
              if (!existingNames.has(array[i].foodList[k].name)) {
                foodMenu.value[j].foodList.push(array[i].foodList[k]);
              }
            }
            break;
          }
        }
      }
      ElMessage.success('导入成功')
    } catch (e){
      ElMessage.warning('格式错误：'+e)
    } finally {
      importDialog.value = false
    }
  }

  //导出数据
  const exportData = async () => {
    await toClipboard(JSON.stringify(foodMenu.value))
    ElMessage.success("复制成功，请保存这段文字！")
  }

  //存储数据至localStorage
  const saveMenuToLocalStorage = () => {
    localStorage.setItem('menus', JSON.stringify(foodMenu.value));
  };

  //从localStorage读取数据
  const loadMenuFromLocalStorage = () => {
    const savedMenu = localStorage.getItem('menus');
    if (savedMenu) {
      try {
        foodMenu.value = JSON.parse(savedMenu);
      } catch (error) {
        console.error('Failed to parse menu data from localStorage:', error);
      }
    }
  }

  //监听数据并存储
  watch(foodMenu, saveMenuToLocalStorage, { deep: true });

  //首次加载渲染数据
  onMounted(()=>{
    loadMenuFromLocalStorage()
  })
</script>

<style scoped>

</style>
