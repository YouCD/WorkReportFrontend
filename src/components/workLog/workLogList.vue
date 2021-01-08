<template>
  <div>

    <div style="float: left;width: 15%">

      <h1 style="padding-left: 28px">工作类别</h1>

      <div style="max-height: 700px;overflow-y: auto;">
        <a-card sys :bordered="false" @click="clearMenu" class="card-box">
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
      </div>
    </div>


    <div style="float: right;width: 85%">
      <div style="padding-bottom: 10px">

        <a-form-model layout="inline" :model="searchForm">

          <a-form-model-item label="日期">
            <a-date-picker style="width: 130px"
                           v-model="searchForm.date"
                           :locale="locale"/>
          </a-form-model-item>
          <a-form-model-item label="工作内容" prop="content">
            <a-input style="width: 300px" v-model="searchForm.content"/>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="searchFormHandler">
              搜索
            </a-button>
          </a-form-model-item>
          <a-form-model-item prop="date">
            <a-radio-group button-style="solid" @change="getWeekChange">
              <a-radio-button value="week">
                本周日志
              </a-radio-button>
              <!--              <a-radio-button  value="month">-->
              <!--                本月日志-->
              <!--              </a-radio-button>-->
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>

      </div>
      <div style="">
        <a-form-model layout="inline" :model="form" :rules="rules" ref="ruleForm">
          <a-form-model-item label="日期" prop="date">
            <a-date-picker style="width: 130px" :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')"
                           v-model="form.date"
                           :locale="locale"/>
          </a-form-model-item>

          <a-form-model-item label="工作大类" prop="type1">
            <a-select style="width: 160px" placeholder="请选择工作大类" v-model="form.type1" @change="addWorkLogType1Change">
              <a-select-option v-for="(item,index) in type1List" :value="item.id" :key="index">
                {{ item.description }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="工作子类" prop="type2">
            <a-select style="width: 160px" placeholder="请选择工作子类" v-model="form.type2">
              <a-select-option v-for="(item,index) in type2List" :value="item.id" :key="index">
                {{ item.description }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="工作内容" prop="content">
            <a-input style="width: 400px" v-model="form.content"/>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="addWorkLogHandler">
              添加
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div style="padding-top: 15px">
        <a-table :columns="columns" :data-source="data" :rowKey='(record,index)=> index' :loading="loading"
                 size="small">


        <span slot="action" slot-scope="record">
              <a @click="showWorkLogEdit(record)">编辑</a>
              <a-divider type="vertical"/>

              <a-popconfirm title="确认删除该记录"
                            ok-text="确认"
                            cancel-text="取消"
                            @confirm="confirmDelete(record)"
              >
                       <a href="#">删除</a>
              </a-popconfirm>
        </span>
        </a-table>

        <a-modal v-model="addWorkLog" title="添加工作日志" @ok="addWorkLogHandler" cancelText="取消" okText="确认">
          <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules" ref="ruleForm">
            <a-form-model-item label="日期" prop="date">
              <a-date-picker :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" v-model="form.date"
                             :locale="locale"/>
            </a-form-model-item>
            <a-form-model-item label="工作大类" prop="type1">
              <a-select placeholder="请选择工作大类" v-model="form.type1" @change="addWorkLogType1Change">
                <a-select-option v-for="(item,index) in type1List" :value="item.id" :key="index">
                  {{ item.description }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="工作子类" prop="type2">
              <a-select placeholder="请选择工作子类" v-model="form.type2">
                <a-select-option v-for="(item,index) in type2List" :value="item.id" :key="index">
                  {{ item.description }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="工作内容" prop="content">
              <a-textarea v-model="form.content"/>
            </a-form-model-item>
          </a-form-model>
        </a-modal>

        <a-modal v-model="editWorkLog" title="编辑工作日志" @ok="editWorkLogHandler" cancelText="取消" okText="确认">
          <a-form-model :model="editForm" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules" ref="ruleForm">
            <a-form-model-item label="日期" prop="date">
              <a-date-picker :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" v-model="editForm.date"
                             :locale="locale"/>
            </a-form-model-item>

            <a-form-model-item label="工作大类" prop="type1">
              <a-select placeholder="请选择工作大类" v-model="editForm.type1" @change="editWorkLogType1Change">
                <a-select-option v-for="(item,index) in type1List" :value="item.id" :key="index">
                  {{ item.description }}
                </a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item label="工作子类" prop="type2">
              <a-select placeholder="请选择工作子类" v-model="editForm.type2">
                <a-select-option v-for="(item,index) in type2List" :value="item.id" :key="index">
                  {{ item.description }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="工作内容" prop="content">
              <a-textarea v-model="editForm.content"/>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </div>

    </div>

  </div>
</template>

<script>
import moment from "moment"
import {
  addWorkLog,
  delWorkLog,
  getWorkLog,
  getWorkLogFromContent,
  getWorkLogFromDate,
  getWorkLogFromType,
  getWorkLogFromWeek,
  getWorkType1,
  getWorkType2,
  modifyWorkLog
} from "../api/worklog"
import locale from "ant-design-vue/lib/date-picker/locale/zh_CN";
import {getWorkType} from "@/components/api/sysdic";

const columns = [
  {
    dataIndex: 'date',
    key: 'date',
    title: '日期',
    customRender: function (time) {
      return moment.unix(time).format("YYYY-MM-DD ");
    }
  },
  {
    title: '工作大类',
    key: 'type1',
    dataIndex: 'type1',
  },
  {
    title: '工作子类',
    key: 'type2',
    dataIndex: 'type2',
  },

  {
    title: '工作内容',
    dataIndex: 'content',
    key: 'content',
  },
  {title: '操作', key: 'action', scopedSlots: {customRender: 'action'},},
];


export default {
  name: "workLogList",
  created() {
    this.getWorkLogHandler()
    this.getWorkType1Handler()
    this.getWorkTreeDataHandler()
  },

  data() {
    return {
      data: [],
      columns,
      loading: false,
      total: 0,
      labelCol: {span: 5},
      wrapperCol: {span: 19},
      locale,
      type1List: [],
      type2List: [],
      sysDicID: undefined,
      form: {
        type1: undefined,
        type2: undefined,
        content: undefined,
        date: moment(this.getCurrentData(), 'YYYY-MM-DD'),
      },
      rules: {
        type1: [{required: true, message: '请选择工作大类', trigger: 'change'},],
        type2: [{required: true, message: '请选择工作子类', trigger: 'change'},],
        content: [{required: true, message: '请输入工作内容', trigger: 'change'},],
        date: [{required: true, message: '请选择日期', trigger: 'change'},],
      },


      addWorkLog: false,

      editWorkLog: false,
      editForm: {
        id: undefined,
        type1: undefined,
        type2: undefined,
        content: undefined,
        date: undefined,
      },

      selectID: undefined,
      editTypeModal: false,
      TypeData: {id: 1, description: undefined, pid: undefined, type: undefined},
      NodeTreeItem: null, // 右键菜单
      tmpStyle: '',
      treeData: [],
      treeDataType1List: [],

      searchForm: {
        content: undefined,
        date: undefined,
      },
    };
  },
  methods: {
    moment,
    getCurrentData() {
      return new Date().toLocaleDateString();
    },

    getWorkType1Handler() {
      getWorkType1().then(res => {
        if (res.data.flag) {
          this.type1List = res.data.data.type_list
        }
      })
    },
    getWorkType2Handler(params) {
      getWorkType2(params).then(res => {
        if (res.data.flag) {
          this.type2List = res.data.data.type_list
        }
      })
    },


    addWorkLogType1Change() {
      let params = {
        pid: this.form.type1
      }
      this.getWorkType2Handler(params)
    },


    addWorkLogHandler() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            type1: this.form.type1,
            type2: this.form.type2,
            content: this.form.content,
            date: this.form.date.startOf('day').unix(),
          }
          addWorkLog(params).then(res => {
            if (res.data.flag) {
              this.form.content = undefined
              this.$message.success(res.data.msg)
              this.getWorkLogHandler()
            } else if (res.data.flag !== true) {
              this.$message.error(res.data.msg)
            }
          });

        } else {

          return false;
        }
      });

    },


    getWorkLogHandler() {
      let params = {}
      getWorkLog(params).then(res => {
        if (res.data.flag) {
          this.data = res.data.data.work_content_resp_list
          // this.showSealAdd = false;
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg)
        }
      });
    },


    showWorkLogEdit(record) {

      this.editWorkLog = true
      this.editForm.id = record.id
      this.editForm.type1 = record.type1_id
      this.editForm.type2 = record.type2_id
      this.editForm.content = record.content
      this.editForm.date = moment.unix(record.date)
      let params = {
        pid: record.type1_id
      }
      this.getWorkType2Handler(params)
    },
    editWorkLogType1Change() {
      let params = {
        pid: this.editForm.type1
      }
      this.editForm.type2 = undefined

      this.getWorkType2Handler(params)
    },


    editWorkLogHandler() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            id: this.editForm.id,
            type1: this.editForm.type1,
            type2: this.editForm.type2,
            content: this.editForm.content,
            date: this.editForm.date.startOf('day').unix(),
          }

          modifyWorkLog(params).then(res => {
            if (res.data.flag) {
              this.$message.success(res.data.msg)
              this.getWorkLogHandler()
              this.editWorkLog = false
            } else if (res.data.flag !== true) {
              this.$message.error(res.data.msg)
              this.editWorkLog = false
            }
          });
        } else {
          return false;
        }
      });
    },


    confirmDelete(record) {
      let params = {
        id: record.id
      }
      delWorkLog(params).then(res => {
        if (res.data.flag) {
          this.getWorkLogHandler()
          this.$message.success(res.data.msg)
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg)
        }
      });
    },

    getWorkTreeDataHandler() {

      getWorkType1().then(res => {
        if (res.data.flag) {
          this.treeDataType1List = res.data.data.type_list
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
      console.log("ccccccccc", selectedKeys)
      this.getWorkLogFromTypeHandler(selectedKeys[0])
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


    getWorkLogFromTypeHandler(id) {
      let params = {
        typeID: id,
        // pageIndex:id,
        // pageSize:id,
      }
      getWorkLogFromType(params).then(res => {
        if (res.data.flag) {
          this.data = []
          this.data = res.data.data.work_content_resp_list
          this.$message.success(res.data.msg)
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg)
        }
      })
    },


    getWeekChange(e) {
      if (e.target.value === "week") {
        getWorkLogFromWeek().then(res => {
          if (res.data.flag) {
            this.data = []
            this.data = res.data.data.work_content_resp_list
          } else if (res.data.flag !== true) {
            this.$message.error(res.data.msg)
          }
        })
      }
    },
    searchFormHandler() {
      if (this.searchForm.date === undefined) {
        getWorkLogFromContent(this.searchForm).then(res => {
          if (res.data.flag) {
            this.data = res.data.data.work_content_resp_list
          } else if (res.data.flag !== true) {
            this.$message.error(res.data.msg)
          }
        })
      } else if (this.searchForm.content === undefined) {
        let params = {
          date: this.searchForm.date.startOf('day').unix(),
        }
        getWorkLogFromDate(params).then(res => {
          if (res.data.flag) {
            this.data = res.data.data.work_content_resp_list
          } else if (res.data.flag !== true) {
            this.$message.error(res.data.msg)
          }
        })
      }

    }

  }
};

</script>

<style scoped>

</style>