<template>
  <div>
    <div>
      <div>
        <a-form-model layout="inline" :model="Type1Data" :rules="rules" ref="ruleForm">
          <a-form-model-item prop="Type1">
            <a-input v-model="Type1Data.Type1" placeholder="请输入工作大类"/>
          </a-form-model-item>

          <a-form-model-item>
            <a-button style="margin-right: 10px" @click="Type1AddHandleOk" type="primary">
              添加工作大类
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>



      <div>
        <a-form-model layout="inline" :model="Type2Data" :rules="rules1" ref="ruleForm2">
          <a-form-model-item  prop="pid">
            <a-select  style="width: 150px" placeholder="请选择工作大类" v-model="Type2Data.pid" >
              <a-select-option  v-for="(item,index) in type1List" :value="item.id" :key="index">
                {{ item.description }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item prop="description">
            <a-input v-model="Type2Data.description" placeholder="请输入工作子类"/>
          </a-form-model-item>

          <a-form-model-item>
            <a-button style="margin-right: 10px" @click="Type2AddHandleOk" type="primary">
              添加工作子类
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>



    </div>

  </div>
</template>

<script>

import {addWorkType} from '../api/sysdic'
import {getWorkType1, getWorkType2} from "@/components/api/worklog";

export default {
  name: "sysDic",
  created() {
    this.getWorkType1Handler()
  },
  data() {
    return {
      rules: {
        Type1: [{required: true, message: '请输入工作大类', trigger: 'change'},],
      },
      rules1: {
        pid: [{required: true, message: '请选择工作大类', trigger: 'change'},],
        description: [{required: true, message: '请输入工作子类', trigger: 'change'},],
      },

      //添加Type1
      showType1: false,
      Type1Data: {
        Type1: undefined,
      },

      Type2Data: {
        pid: undefined,
        description: undefined,
      },
      type1List: [],

    };
  },

  methods: {

    //添加type1
    Type1AddHandleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            description: this.Type1Data.Type1,
            type: 1,
            pid: 0
          }
          addWorkType(params).then(res => {
            if (res.data.flag) {
              this.$message.success(res.data.msg)
              // this.getWorkType1Handler()
              this.showType1 = false;
            } else if (res.data.flag !== true) {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          return false;
        }
      });
    },
    Type2AddHandleOk() {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          let params = {
            description: this.Type2Data.description,
            type: 2,
            pid: this.Type2Data.pid
          }
          // console.log(params)
          addWorkType(params).then(res => {
            if (res.data.flag) {
              this.$message.success(res.data.msg)
              // this.getWorkType1Handler()
              this.showType1 = false;
            } else if (res.data.flag !== true) {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          return false;
        }
      });
    },

    getWorkType1Handler() {
      getWorkType1().then(res => {
        if (res.data.flag) {
          this.type1List = res.data.data.type_list
        }
      })
    },


    addWorkLogType1Change() {
      let params = {
        pid: this.form.id
      }

      // this.getWorkType2Handler(params)
    },
  }
}
</script>

<style scoped>

</style>