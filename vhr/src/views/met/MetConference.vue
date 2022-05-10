<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button icon="el-icon-plus" type="primary" @click="showAddConferenceView">新增</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initConference"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
              :data="conferences"
              border
              stripe
              style="width: 100%">
        <el-table-column
                type="selection"
                align="left"
                width="55">
        </el-table-column>
        <el-table-column
                prop="title"
                label="名称"
                align="center"
                width="60">
        </el-table-column>
        <el-table-column
                prop="meetingPlace"
                label="会议地点"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="convener"
                label="召集人"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="contact"
                label="联系人"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="startTime"
                label="开始时间"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="endTime"
                label="结束时间"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="status"
                label="会议状态"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                label="操作"
                align="center">
          <template slot-scope="scope">
            <el-button @click="showEditConferenceView(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteConference(scope.row)">删除</el-button>
          </template>

        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
                background
                @size-change="sizeChange"
                @current-change="currentChange"
                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title=dialogTitle :visible.sync="dialogVisible">
      <el-form :model="conference">
        <el-form-item label="名称" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="conference.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议地点" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="conference.meetingPlace" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="召集人" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="conference.convener" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="conference.contact" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth" style="width: 80%">
          <el-date-picker
                  v-model="conference.startTime"
                  type="datetime"
                  style="width: 100%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth" style="width: 80%">
          <el-date-picker
                  v-model="conference.endTime"
                  type="datetime"
                  style="width: 100%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议状态" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="conference.status" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddConference">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'MetConference',
    data() {
      return {
        dialogVisible: false,
        dialogTitle: '新增',
        conferences:[],
        conference: {
          id: undefined,
          title: undefined,
          meetingPlace: undefined,
          convener: undefined,
          contact: undefined,
          startTime: undefined,
          endTime: undefined,
          status: undefined
        },
        formLabelWidth: '120px'
      }
    },
    mounted () {
      this.initConference();
    },
    methods: {
      deleteConference(data) {
        this.$confirm('此操作将删除【' + data.title + '】培训记录，是否继续？','提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          console.log(data)
          this.deleteRequest("/meeting/conference/" + data.id).then(resp => {
            if (resp) {
              this.initConference();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      initConference() {
        this.getRequest("/meeting/conference/").then(resp => {
          if (resp) {
            this.conferences = resp.data;
          }
        })
      },
      showAddConferenceView() {
        //数据初始化
        this.conference = {
          id: "",
          title: "",
          meetingPlace: "",
          convener: "",
          contact: "",
          startTime: "",
          endTime: "",
          status: ""
        }
        this.dialogVisible = true;
        this.dialogTitle = '新增';
      },
      showEditConferenceView(data) {
        this.dialogTitle = '修改';
        this.dialogVisible = true;
        this.conference.id = data.id;
        this.conference.title = data.title;
        this.conference.meetingPlace = data.meetingPlace;
        this.conference.convener = data.convener;
        this.conference.contact = data.contact;
        this.conference.startTime = data.startTime;
        this.conference.endTime = data.endTime;
        this.conference.status = data.status;
      },
      doAddConference() {
        if (this.conference.id) {
          this.putRequest('/meeting/conference/',this.conference).then(resp => {
            if (resp) {
              this.initConference();
              this.dialogVisible = false;
            }
          })
        } else {
          this.postRequest('/meeting/conference/',this.conference).then(resp => {
            if (resp) {
              this.initConference();
              this.dialogVisible = false;
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>