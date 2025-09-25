<template>
    <div class="container" ref="containerRef"> 
        <div style="width: 600px;">
            <img src="/img/loading.gif" alt="" class="container-img"></img>
            <p>
                画面中，一株孤傲的向日葵在晨雾中微微低垂，金黄色的花瓣边缘凝结着晶莹的露珠，
                仿佛镶嵌了无数颗微小的钻石。背景是朦胧的远山，被初升的朝阳染成了淡淡的橘粉色。
                向日葵的茎秆呈现出深绿色，上面布满了细小的绒毛，在逆光下泛着银白色的光泽。
                画面左下角有一只蜜蜂正在采蜜，它的翅膀在阳光下几乎透明，与花瓣形成动人的互动。
                整幅画面的色调温暖而柔和，光影交错间营造出宁静而充满生机的氛围，仿佛能让人闻到泥土的芬芳和花蜜的甜香。
            </p>
        </div>
        <el-input type="textarea" v-model="text" :rows="22" class="container-input" spellcheck="false"/>
    </div>
  </template>
  <script setup lang="ts">
  import { ref,onMounted,onUnmounted } from 'vue'

  const containerRef = ref(null)

  const text = ref(`
      <div style="width: 600px;">
            <img src="/img/loading.gif" alt="" class="container-img"></img>
            <p>
                画面中，一株孤傲的向日葵在晨雾中微微低垂，金黄色的花瓣边缘凝结着晶莹的露珠，
                仿佛镶嵌了无数颗微小的钻石。背景是朦胧的远山，被初升的朝阳染成了淡淡的橘粉色。
                向日葵的茎秆呈现出深绿色，上面布满了细小的绒毛，在逆光下泛着银白色的光泽。
                画面左下角有一只蜜蜂正在采蜜，它的翅膀在阳光下几乎透明，与花瓣形成动人的互动。
                整幅画面的色调温暖而柔和，光影交错间营造出宁静而充满生机的氛围，仿佛能让人闻到泥土的芬芳和花蜜的甜香。
            </p>
        </div>

             .container-img {
                width: 150px;
                height: 150px;
                float: left;
                margin-right: 1em;
                object-fit: cover;
                border-radius: 50%;
                shape-outside: circle(50% at 50% 50%);
            }
            p {
                line-height: 2;
            }
  `)

   //将属性或者函数暴露给父组件
   defineExpose({ text });
  </script>
  <style lang="scss" scoped>
  .container-img {
    width: 150px;
    height: 150px;
    float: left;
    margin-right: 1em;
    object-fit: cover;
    border-radius: 50%;
    shape-outside: circle(50% at 50% 50%);
  }
  p {
    line-height: 2;
  }
  
  </style>
  