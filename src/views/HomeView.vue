<template>
  <div class="home">
 <Scene :eventList="eventList"></Scene>
 <BigScreen :dataInfo="dataInfo" :eventList="eventList"></BigScreen>
  </div>
</template>

<script setup>
// @ is an alias to /src
import { getSmartCityInfo, getSmartCityList } from "@/api/api";
import BigScreen from '@/components/BigScreen.vue';
import Scene from '@/components/Scene.vue'

import gsap from 'gsap';

import { onMounted, reactive, ref,watch } from "vue";
const dataInfo = reactive({
    iot:{number:0},
    event:{number:0},
    power:{number:0},
    test:{number:0},

});
onMounted(async ()=>{
  changeInfo();
  getEventList();
  setInterval(()=>{
    changeInfo();
    getEventList();
  },5000);
});
const changeInfo=async ()=>{
  let res = await getSmartCityInfo();
  // dataInfo.iot = res.data.data.iot; 
  // dataInfo.event = res.data.data.event;
  // dataInfo.power = res.data.data.power;
  // dataInfo.test = res.data.data.test;
  // dataInfo.iot={name:res.data.data.iot.name,unit:res.data.data.iot.unit};
  // gsap.to(dataInfo.iot,{
  //   number:res.data.data.iot.number,
  //   duration:1,
  // });
  // gsap.to(dataInfo.event,{
  //   number:res.data.data.event.number,
  //   duration:1,
  // });
  // gsap.to(dataInfo.power,{
  //   number:res.data.data.power.number,
  //   duration:1,
  // });
  // gsap.to(dataInfo.test,{
  //   number:res.data.data.test.number,
  //   duration:1,
  // });
  for (let key in dataInfo) {
    dataInfo[key].name = res.data.data[key].name;
    dataInfo[key].unit = res.data.data[key].unit;
    gsap.to(dataInfo[key], {
      number: res.data.data[key].number,
      duration: 1,

      
    });
  }
};
const eventList = ref([]);
const getEventList = async () => {
  let result = await getSmartCityList();
  eventList.value = result.data.list;
   console.log(result.data.list);
};
</script>
