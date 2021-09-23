<template>
  <div>
    <a-drawer
        title="工作类别"
        placement="left"
        :closable="false"
        :visible="visible"
        :after-visible-change="afterVisibleChange"
        @close="onClose"
    >
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
    </a-drawer>


    <div>
      <a-button size="small" style="display: inline-block;margin-right: 10px" v-if="is_Mobile" type="primary"
                @click="MobileSearch">
        展开搜索
      </a-button>
      <a-button size="small" style="display: inline-block;margin-right: 10px" v-if="is_Mobile" type="primary"
                @click="MobileAddWorkLog">
        添加日志
      </a-button>
      <a-button size="small" style="display: inline-block;margin-right: 10px" v-if="is_Mobile" type="primary"
                @click="showDrawer">
        工作类别
      </a-button>
      <a-button size="small" v-if="is_Mobile" type="primary" @click="MobileGetWeekChange">
        本周日志
      </a-button>
      <div v-if="showSearch">

        <a-form-model :layout="layout" :model="searchForm">

          <a-form-model-item v-if="!showWorkType" style="padding-right: 10px">
            <a-button type="primary" @click="showDrawer">
              工作类别
            </a-button>
          </a-form-model-item>

          <a-form-model-item v-if="!showWorkType" style="padding-right: 50px">
            <a-button type="primary" @click="showExportWorkLogHandler">
              导出日志
            </a-button>
          </a-form-model-item>


          <a-form-model-item label="日期">
            <a-date-picker :disabled='showSearchDate' v-model="searchForm.date" :locale="locale"/>
          </a-form-model-item>


          <a-form-model-item label="工作内容" prop="content">
            <a-input v-model="searchForm.content"/>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="searchFormHandler">
              搜索
            </a-button>
          </a-form-model-item>
          <a-form-model-item v-if="!is_Mobile" prop="date">
            <a-button type="primary" @click="getWeekChange">
              本周日志
            </a-button>
          </a-form-model-item>
        </a-form-model>

      </div>


      <div v-if="showAddWorkLog">
        <a-form-model :layout="layout" :model="form" :rules="rules" ref="ruleForm">
          <a-form-model-item label="日期" prop="date">
            <a-date-picker :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" v-model="form.date"/>
          </a-form-model-item>

          <a-form-model-item label="工作大类" prop="type1">
            <a-select style="width: 150px" placeholder="请选择工作大类" v-model="form.type1"
                      @change="addWorkLogType1Change">
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
            <a-input style="width: 100%" v-model="form.content"/>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="addWorkLogHandler">
              添加
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div style="padding-top: 15px">
        <a-table v-if="showTable" @change="handleTableChange" :columns="columns" :data-source="data"
                 :rowKey='(record,index)=> index' :loading="loading" size="small" :pagination="pagination"
                 :scroll="{ x: 800 }">
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
        <div v-if="!showTable">
          <div v-for="(item,i) in weekData" :key="i">
            {{ i }}:<br/>
            <div v-for="(item1,i1) in item" :key="i1">{{ kg }}{{ i1 + 1 }}.{{ item1 }}</div>
          </div>
        </div>
        <a-modal v-model="addWorkLog" title="添加工作日志" @ok="addWorkLogHandler" cancelText="取消" okText="确认">
          <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules"
                        ref="ruleForm">
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
          <a-form-model :model="editForm" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules"
                        ref="ruleForm">
            <a-form-model-item label="日期" prop="date">
              <a-date-picker :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')"
                             v-model="editForm.date"
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


        <a-modal v-model="exportWorkLog" title="导出日志" @ok="exportWorkLogHandler" cancelText="取消" okText="下载">
          <a-form-model :model="exportForm" :label-col="labelCol" :wrapper-col="wrapperCol"
                        :rules="exportFormRules" ref="exportForm">
            <a-form-model-item label="日期范围" prop="dateRange">
              <a-range-picker v-model="exportForm.dateRange" :locale="locale" @change="dateRangeChange"/>
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
    },
    width: 120,
    fixed: 'left'
  },
  {
    title: '工作大类',
    key: 'type1',
    dataIndex: 'type1',
    width: 120,
  },
  {
    title: '工作子类',
    key: 'type2',
    dataIndex: 'type2',
    width: 120,

  },

  {
    title: '工作内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 100, fixed: 'right'
  },
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
      labelCol: {span: 5},
      wrapperCol: {span: 19},
      pagination: {
        size: "small",
        showSizeChanger: true,
        pageSize: 15,
        total: 0,
        pageSizeOptions: ["10", "15", "20", "50", "100"], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条工作记录`, //分页中显示总的数据
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 15,
      },

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
        content: "",
        date: undefined,
      },


      weekData: undefined,
      showTable: true,
      kg: "\u3000\u3000\u3000",


      visible: false,
      layout: undefined,
      is_Mobile: false,
      showWorkType: false,
      showSearch: false,
      showAddWorkLog: false,

      exportWorkLog: false,
      exportFormRules: {
        dateRange: [{required: true, message: '请选择日期范围', trigger: 'change'},],
      },
      exportForm: {
        dateRange: undefined,
      },
      dateRange: {
        dateStart: undefined,
        dateEnd: undefined
      },
      backUrl: "/w/downloadWorklog",

      showSearchDate: false,

      isSelectDrawer: false,
      DrawerKey: undefined,
    };
  },
  watch: {
    //   DrawerKey: function (val) {
    //     this.pageInfo.pageIndex =1
    //   },

    searchForm: {
      handler(newName, oldName) {
        if (newName.content == "") {
          this.showSearchDate = false;
        } else if (newName.content !== "") {
          this.showSearchDate = true;
        }

      },
      deep: true,
    },

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
      this.showTable = true
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
      getWorkLog(this.pageInfo).then(res => {
        if (res.data.flag) {
          this.data = res.data.data.work_content_resp_list
          this.pagination.total = res.data.data.sum
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

    handleTableChange(page, pageSize) {
      if (this.searchForm.content == "") {
        this.pageInfo.pageSize = page.pageSize;
        this.pageInfo.pageIndex = page.current;
        this.getWorkLogHandler()
      } else if (this.searchForm.content !== "") {
        this.searchFormHandler()
      }
      if (this.isSelectDrawer) {
        this.getWorkLogFromTypeHandler(this.DrawerKey)
      }

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


      this.DrawerKey = selectedKeys[0]
      this.isSelectDrawer = true
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
        pageIndex: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize,
      }
      getWorkLogFromType(params).then(res => {
        this.showTable = true
        if (res.data.flag) {
          this.data = []
          this.data = res.data.data.work_content_resp_list
          this.pagination.total = res.data.data.sum
          //this.$message.info("刷新页面重置当前的筛选状态。")
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg)
        }
      })
    },


    getWeekChange() {
      this.showTable = !this.showTable
      getWorkLogFromWeek().then(res => {
        if (res.data.flag) {
          this.weekData = []
          this.weekData = res.data.data
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg)
        }
      })
    },
    MobileGetWeekChange() {
      this.showTable = !this.showTable
      this.showSearch = false
      this.showAddWorkLog = false
      getWorkLogFromWeek().then(res => {
        if (res.data.flag) {
          this.weekData = []
          this.weekData = res.data.data
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg)
        }
      })
    },
    searchFormHandler() {
      if (this.searchForm.date === undefined || this.searchForm.content !== "") {
        this.showTable = true
        getWorkLogFromContent(this.searchForm).then(res => {
          if (res.data.flag) {
            this.data = res.data.data.work_content_resp_list
            this.pagination.total = res.data.data.sum
          } else if (res.data.flag !== true) {
            this.$message.error(res.data.msg)
          }
        })
      } else if (this.searchForm.content == "") {
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
    },

    afterVisibleChange(val) {

      // console.log('visible', val);
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },


    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      return flag;
    },
    layoutHandler() {
      if (!this.isMobile()) {
        this.layout = "inline"
        this.is_Mobile = false
        this.showSearch = true
        this.showAddWorkLog = true
      } else if (this.isMobile()) {
        this.layout = "horizontal"
        this.is_Mobile = true
        this.showWorkType = true
      }
    },


    MobileSearch() {
      this.showAddWorkLog = false
      this.showSearch = !this.showSearch
    },
    MobileAddWorkLog() {
      this.showSearch = false
      this.showAddWorkLog = !this.showAddWorkLog
    },

    dateRangeChange(date, dateString) {
      this.dateRange.dateStart = date[0].startOf('day').unix()
      this.dateRange.dateEnd = date[1].startOf('day').unix()
    },
    exportWorkLogHandler() {
      this.$refs.exportForm.validate(valid => {
        if (valid) {
          if (process.env.VUE_APP_API_ROOT) {
            this.backUrl = process.env.VUE_APP_API_ROOT + this.backUrl
          }
          let url = this.backUrl + "?dateStart=" + this.dateRange.dateStart + "&dateEnd=" + this.dateRange.dateEnd

          this.downLoadByUrl(url)
          this.exportWorkLog = false
        } else {
          return false;
        }
      });
      this.exportWorkLog = false
    },

    downLoadByUrl(url) {
      var xhr = new XMLHttpRequest();
      //GET请求,请求路径url,async(是否异步)
      xhr.open('GET', url, true);
      //设置请求头参数的方式,如果没有可忽略此行代码
      xhr.setRequestHeader("jwt", localStorage.getItem('jwt',));
      //设置响应类型为 blob
      xhr.responseType = 'blob';
      //关键部分
      xhr.onload = function (e) {
        //如果请求执行成功
        if (this.status == 200) {
          let blob = this.response;
          let filename = "WorkLog.xlsx";
          let a = document.createElement('a');

          // blob.type = "application/octet-stream";
          //创键临时url对象
          let url = URL.createObjectURL(blob);

          a.href = url;
          a.download = filename;
          a.click();
          //释放之前创建的URL对象
          window.URL.revokeObjectURL(url);
        }
      };
      //发送请求
      xhr.send();
    },

    showExportWorkLogHandler() {
      this.exportWorkLog = true
    }
  },

  mounted() {
    this.layoutHandler()

  },


};

</script>

<style scoped>

</style>
