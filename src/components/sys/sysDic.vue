<template>
  <div>
    <div>
      <div>
        <div style="margin-bottom: 50px">
          <div :style="styleHandler">
            <a-form-model :layout="layout" :model="Type1Data" :rules="rules" ref="ruleForm">
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
          <div >
            <a-form-model :layout="layout" :model="Type2Data" :rules="rules1" ref="ruleForm2">
              <a-form-model-item prop="pid">
                <a-select style="width: 150px" placeholder="请选择工作大类" v-model="Type2Data.pid">
                  <a-select-option v-for="(item,index) in type1List" :value="item.id" :key="index">
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
        <div style="max-height: 80vh;overflow-y: auto;width: 25%;padding-top: 10px;">
          <a-card :bordered="false" @click="clearMenu" class="card-box">
            <a-tree
                v-if="treeData.length>0"
                :treeData="treeData"
                :defaultExpandParent="true"
                @select="onSelect"
                @rightClick="onRightClick"
            ></a-tree>
            <div :style="tmpStyle" v-if="NodeTreeItem">
              <div class="menu-item" @click="orgAdd">
                <a-tooltip placement="bottom" title="新增子节点">
                  <a-icon type="plus-circle-o"/>
                </a-tooltip>
              </div>
              <div class="menu-item" @click="orgEdit">
                <a-tooltip placement="bottom" title="修改">
                  <a-icon type="edit"/>
                </a-tooltip>
              </div>
              <div class="menu-item" @click="orgDelete" v-if="NodeTreeItem.parentOrgId">
                <a-tooltip placement="bottom" title="删除">
                  <a-icon type="minus-circle-o"/>
                </a-tooltip>
              </div>
            </div>
          </a-card>
          <a-modal v-model="editTypeModal" title="修改工作类别" cancelText="取消" okText="确认" @ok="editTypeHandleOk">
            <a-form-model :model="TypeData" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules1"
                          ref="ruleForm">
              <a-form-model-item label="类别名称" prop="description">
                <a-input v-model="TypeData.description" placeholder="请输入类别名称"/>
              </a-form-model-item>

              <a-form-model-item v-if="TypeData.pid >0" label="工作大类" prop="pid">
                <a-select placeholder="请选择工作大类" v-model="TypeData.pid" >
                  <a-select-option v-for="(item,index) in type1List" :value="item.id" :key="index">
                    {{ item.description }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

            </a-form-model>
          </a-modal>

        </div>
      </div>


    </div>

  </div>
</template>

<script>

import {addWorkType} from '../api/sysdic'
import {getWorkType1, getWorkType2} from "@/components/api/worklog";
import {getWorkType,editWorkType} from "@/components/api/sysdic";

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

      NodeTreeItem: null, // 右键菜单
      tmpStyle: '',
      treeData: [],


      selectID: undefined,
      editTypeModal: false,
      TypeData: {id: 1, description: undefined, pid: undefined, type: undefined},
      labelCol: {span: 5},
      wrapperCol: {span: 18},


      layout:undefined,
      styleHandler:undefined,
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
          for (let i = 0; i < res.data.data.type_list.length; i++) {
            let params = {
              pid: res.data.data.type_list[i].id
            }
            this.treeData.push({
              title: res.data.data.type_list[i].description,
              key: res.data.data.type_list[i].id,
              children: []
            })
            getWorkType2(params).then(resc => {
              if (resc.data.flag) {
                for (let c = 0; c < resc.data.data.type_list.length; c++) {
                  if (res.data.data.type_list[i].id === resc.data.data.type_list[c].pid) {
                    this.treeData[i].children.push({
                      title: resc.data.data.type_list[c].description,
                      key: resc.data.data.type_list[c].id,
                    })
                  }
                }
              }
            })

          }
        }
      })
    },


    onSelect(selectedKeys, info) {
      console.log(selectedKeys)
      this.queryParam = {
        orgId: selectedKeys[0]
      };
      // 写自己的业务逻辑
      // this.$refs.table.refresh(true);
    },
    onRightClick({event, node}) {
      const x =
          event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
      const y = event.currentTarget.offsetTop;
      this.NodeTreeItem = {
        pageX: x,
        pageY: y,
        id: node._props.eventKey,
        title: node._props.title,
        parentOrgId: node._props.dataRef.parentOrgId || null
      };
      this.selectID = node._props.eventKey
      this.tmpStyle = {
        position: 'absolute',
        maxHeight: 40,
        textAlign: 'center',
        left: `${x + 10 - 0}px`,
        top: `${y + 6 - 0}px`,
        display: 'flex',
        flexDirection: 'row'
      };
    },
    // 用于点击空白处隐藏增删改菜单
    clearMenu() {
      // this.NodeTreeItem = null;
    },
    orgAdd() {
      // 写自己的业务逻辑
    },
    orgEdit() {
      // console.log(e.key)
      // 写自己的业务逻辑
      this.editTypeModal = true


      let params = {
        id: this.selectID
      }

      getWorkType(params).then(res => {
        if (res.data.flag) {
          this.TypeData = res.data.data
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg)
        }
      })
    },
    orgDelete() {
      // 写自己的业务逻辑
    },



    editTypeHandleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log(this.TypeData)

          editWorkType(this.TypeData).then(res => {
            if (res.data.flag) {
              this.$message.success(res.data.msg)
              this.treeData=[]
              this.getWorkType1Handler()
              this.editTypeModal  = false;
            } else if (res.data.flag !== true) {
              this.$message.error(res.data.msg)
              this.editTypeModal  = false;
            }
          })
        } else {
          return false;
        }
      });
    },


    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      return flag;
    },
    layoutHandler(){
      if(!this.isMobile()){
        this.layout= "inline"
        this.is_Mobile= false
        this.styleHandler= "float: left"

      }else if (this.isMobile()){
        this.layout= "horizontal"

      }
    },

  },

  mounted() {
    this.layoutHandler()

  },
}
</script>

<style scoped>

</style>