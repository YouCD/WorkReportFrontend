<template>
  <div>
    <div>

<!--      <a-button type="primary" @click="showAddWorkLogModal">-->
<!--        添加日志-->
<!--      </a-button>-->


      <a-form-model layout="inline" :model="form" :rules="rules" ref="ruleForm">
        <a-form-model-item label="日期" prop="date">
          <a-date-picker style="width: 130px" :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" v-model="form.date"
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
          <a-input style="width: 300px" v-model="form.content"/>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="addWorkLogHandler">
            添加
          </a-button>
        </a-form-model-item>
      </a-form-model>



    </div>
    <div style="padding-top: 15px">
      <a-table :columns="columns" :data-source="data" :rowKey='(record,index)=> index' :loading="loading">


        <span slot="action" slot-scope="record">
<!--              <a @click="showSealInfo(record)">查看</a>-->
          <!--              <a-divider type="vertical"/>-->
              <a @click="showWorkLogEdit(record)">编辑</a>
          <!--              <a-divider type="vertical"/>-->
          <!--              <a @click="showSealInvalid(record)"-->
          <!--                 :disabled='record.newspaper_name!==""&&record.newspaper_time!==0'>作废</a>-->
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
            <a-date-picker :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" v-model="form.date" :locale="locale"/>
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
            <a-date-picker disabled :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" v-model="editForm.date"
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
</template>

<script>
import moment from "moment"
import {addWorkLog, delWorkLog, getWorkLog, getWorkType1, getWorkType2, modifyWorkLog} from "../api/worklog"
import locale from "ant-design-vue/lib/date-picker/locale/zh_CN";

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
        date: moment(this.getCurrentData(), 'YYYY-MM-DD'),
      },
    };
  },
  methods: {
    moment,
    getCurrentData() {
      return new Date().toLocaleDateString();
    },

    showAddWorkLogModal() {
      this.addWorkLog = true

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
              this.$message.success(res.data.msg)
              // this.getSealsHanler()
              // this.showSealAdd = false;
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
    }
  }
};

</script>

<style scoped>


</style>