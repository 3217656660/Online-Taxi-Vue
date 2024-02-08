<template>
  <div id="acceptList">

    <div class="title">
      <h3>可接单列表</h3>
    </div>
    
    <div class="acceptAbleList">
      <el-table :data="tableData">
        <el-table-column prop="startAddress" label="开始地" width="100">
        </el-table-column>
        <el-table-column prop="endAddress" label="结束地" width="100">
        </el-table-column>
        <el-table-column prop="distance" label="距离">
        </el-table-column>
        <el-table-column prop="price" label="估价" >
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">接单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <map-component style="display: none;" ref="childMap" @child-loaded="getPosition"/>
  </div>
</template>

<script>
import MapComponent from '@/components/home/MapComponent.vue';
import { requestGateway } from '@/network/request';
import store from '@/store';

export default {
  name: "AcceptListComponent",
  mounted(){
    //获取司机地理位置信息
    //this.getPosition();
  },
  components: {
    MapComponent
  },
  data(){
    return {
      tableData: [
        { 
          id: 1,
          userId: 1,
          startAddress: '八五三农场',
          endAddress: '八五二农场',
          distance: 30.34 + 'km',
          price: 50.12 + '元',
        }
      ],
      AMap: null,
    }
  },
  methods: {
      handleClick(row) {
        console.log(row);
      },


      getPosition(){
        //获取位置信息,并存入仓库中
        const vm = this;
        vm.AMap = vm.$refs.childMap.aMap;
        
        vm.AMap.plugin('AMap.Geolocation', function() {
          const geolocation = new vm.AMap.Geolocation({
            provider: 'device', 
            timeout: 20000, // 设置定位超时时间，默认：无穷大
          })
          geolocation.getCurrentPosition(function(status,result){
            if(status=='complete'){
              //获取司机可接单列表
              console.log('result :>> ', result);
              this.getList();
            }else{
              console.log('err :>> ', result);
            }
          });
        });
        store.commit('setDriverActionTakeOrderVo', {});
      },


      getList(){
        const vm = this;
        requestGateway({
          url: '/api/main/getAbleOrderList',
          method: 'get',
          data: {

          }
        }).then(res => {
          console.log('res :>> ', res);
          vm.tableData = res.data;
        }).catch(err => {
          console.log('err :>> ', err);
        })
      },



    },

}
</script>

<style scoped>
  @import url('@/assets/css/accept.css');

</style>