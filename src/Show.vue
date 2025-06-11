<template>
  <div class="menu">
    <div class="header">
      <h1 class="name" @click="updateShow">{{price}}</h1>
    </div>
    <div class="box">
      <div :class="array.leftData.length!=array.rightData.length?'change-font':''">
        <div v-for="(item,index) in array.leftData" :key="index" @click="deleteLeft(index)">
          <span class="name">{{item.name}}</span>
        </div>
      </div>
      <div>
        <div v-for="(item,index) in array.rightData" :key="index" @click="deleteRight(index)">
          <span class="name">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
interface MyProps {
  price:number
  leftData: FoodDetail[]
  rightData: FoodDetail[]
  showVisible:boolean
}
const emit = defineEmits(['update:show-visible','update:delete-left','update:delete-right']);
const array = defineProps<MyProps>();
const updateShow = ()=>{
  emit('update:show-visible',!array.showVisible)
}

const deleteLeft = (index:number)=>{
  emit('update:delete-left',index)
}

const deleteRight = (index:number)=>{
  emit('update:delete-right',index)
}
</script>

<style scoped>
/* styles.css */
@font-face {
  font-family: 'LiSu'; /* 给字体起一个名字 */
  src: url('/隶书_GBK.TTF');
  font-weight: normal; /* 字体的粗细 */
  font-style: normal; /* 字体的风格 */
}
.menu{
  width: 816px;
  height: 1169px;
  font-family: 'LiSu',sans-serif !important;
  padding: 20px;
}

.header{
  margin-top: 20px;
  width: 100%;
  text-align: center;
}

.box{
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.box>div {
  display: flex;
  flex-direction:column;
  justify-content: space-between;
  width: 50%;
  text-align: left;
  overflow: hidden;
  font-size: 40px;
}

.box>div>div{
  padding: 10px;
}
.change-font>div{
  font-size: 42px;
}
.name{
  cursor: pointer;
  font-size: 42px;
}
</style>
