<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button icon="el-icon-plus" type="primary" @click="showAddTimeSheetView">新增</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initTimeSheet"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
              :data="timeSheets"
              border
              stripe
              style="width: 100%">
        <el-table-column
                type="selection"
                align="left"
                width="55">
        </el-table-column>
        <el-table-column
                prop="name"
                label="姓名"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="workDays"
                label="工作天数"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="normalClockin"
                label="正常打卡"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="lateDays"
                label="迟到天数"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="absentDays"
                label="旷工天数"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="earlyDays"
                label="早退天数"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="leaveNums"
                label="请假次数"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="makeupNums"
                label="补卡次数"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                label="操作"
                align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showEditTimeSheetView(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteTimeSheet(scope.row)">删除</el-button>
          </template>

        </el-table-column>
      </el-table>

    </div>
    <el-dialog :title=dialogTitle :visible.sync="dialogVisible">
      <el-form :model="timeSheet" ref="timeSheetForm">
        <el-form-item label="姓名" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="timeSheet.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工作天数" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="timeSheet.workDays" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="正常打卡" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="timeSheet.normalClockin" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="迟到天数" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="timeSheet.lateDays" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="旷工天数" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="timeSheet.absentDays" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="早退天数" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="timeSheet.earlyDays" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请假次数" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="timeSheet.leaveNums" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="补卡次数" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="timeSheet.makeupNums" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddTimeSheet">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PerAttend',
    data() {
      return {
        dialogVisible: false,
        dialogTitle: '新增',
        timeSheets:[],
        timeSheet: {
          id: "",
          name: "",
          workDays: "",
          normalClockin: "",
          lateDays: "",
          absentDays: "",
          earlyDays: "",
          leaveNums: "",
          makeupNums: ""
        },
        formLabelWidth: '120px'
      }
    },
    mounted () {
      this.initTimeSheet();
    },
    methods: {
      deleteTimeSheet (data) {
        this.$confirm('此操作将删除【' + data.name + '】考勤记录，是否继续？', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          console.log(data)
          this.deleteRequest("/personnel/timesheet/" + data.id).then(resp => {
            if (resp) {
              this.initTimeSheet();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      initTimeSheet () {
        this.getRequest("/personnel/timesheet/").then(resp => {
          if (resp) {
            this.timeSheets = resp.data;
          }
        })
      },
      showAddTimeSheetView () {
        //数据初始化
        this.timeSheet = {
          id: "",
          name: "",
          workDays: "",
          normalClockin: "",
          lateDays: "",
          absentDays: "",
          earlyDays: "",
          leaveNums: "",
          makeupNums: ""
        }
        this.dialogVisible = true;
        this.dialogTitle = '新增';
      },
      showEditTimeSheetView (data) {
        this.dialogTitle = '编辑';
        this.dialogVisible = true;
        this.timeSheet.id = data.id;
        this.timeSheet.name = data.name;
        this.timeSheet.workDays = data.workDays;
        this.timeSheet.normalClockin = data.normalClockin;
        this.timeSheet.lateDays = data.lateDays;
        this.timeSheet.absentDays = data.absentDays;
        this.timeSheet.earlyDays = data.earlyDays;
        this.timeSheet.leaveNums = data.leaveNums;
        this.timeSheet.makeupNums = data.makeupNums;

      },
      doAddTimeSheet () {
        if (this.timeSheet.id) {
          this.$refs['timeSheetForm'].validate(valid => {
            if (valid) {
              this.putRequest('/personnel/timesheet/', this.timeSheet).then(resp => {
                if (resp) {
                  this.initTimeSheet();
                  this.dialogVisible = false;
                }
              })
            }
          });
        } else {
          this.$refs['timeSheetForm'].validate(valid => {
            if (valid) {
              this.postRequest('/personnel/timesheet/', this.timeSheet).then(resp => {
                if (resp) {
                  this.initTimeSheet();
                  this.dialogVisible = false;
                }
              });
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>