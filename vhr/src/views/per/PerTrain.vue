<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button icon="el-icon-plus" type="primary" @click="showAddEmpTrainView">添加员工培训</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initEmpTrains"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
              :data="empTrains"
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
                width="130">
        </el-table-column>
        <el-table-column
                prop="participants"
                label="参加对象"
                align="center"
                width="130">
        </el-table-column>
        <el-table-column
                prop="theme"
                label="主题"
                align="center"
                width="130">
        </el-table-column>
        <el-table-column
                prop="lecturer"
                label="主讲老师"
                align="center"
                width="130">
        </el-table-column>
        <el-table-column
                prop="content"
                label="内容"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                prop="place"
                label="地点"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                prop="shareTime"
                label="分享时间"
                align="center"
                width="180">
        </el-table-column>
        <el-table-column
                label="操作"
                align="center">
          <template slot-scope="scope">
            <el-button @click="showEditEmpTrainView(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteEmpTrain(scope.row)">删除</el-button>
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
      <el-form :model="empTrain">
        <el-form-item label="姓名" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empTrain.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参加对象" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empTrain.participants" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="主题" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empTrain.theme" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="主讲老师" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empTrain.lecturer" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empTrain.content" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地点" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empTrain.place" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分享时间" :label-width="formLabelWidth" style="width: 80%">
          <el-date-picker
                  v-model="empTrain.shareTime"
                  type="datetime"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  placeholder="分享时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddEmpTrain">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PerTrain',
    data() {
      return {
        dialogVisible: false,
        dialogTitle: '新增',
        empTrains: [],
        total: 0,
        currentPage: 1,
        currentSize: 10,
        empTrain: {
          id: "",
          name: "",
          participants: "",
          theme: "",
          lecturer: "",
          content: "",
          place: "",
          shareTime: ""
        },
        formLabelWidth: '130px'
      }
    },
    mounted () {
      this.initEmpTrains();
    },
    methods: {
      sizeChange(size) {
        this.currentSize = size;
        this.initEmpTrains();
      },
      currentChange(page) {
        this.currentPage = page;
        this.initEmpTrains();
      },
      deleteEmpTrain(data) {
        console.log("delete")
        this.$confirm('此操作将删除【' + data.name + '】培训记录，是否继续？','提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          console.log(data)
          this.deleteRequest("/personnel/train/" + data.id).then(resp => {
            if (resp) {
              this.initEmpTrains();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      initEmpTrains() {
        this.getRequest("/personnel/train/").then(resp => {
          if (resp) {
            this.empTrains = resp.data;
          }
        })
      },
      showAddEmpTrainView() {
        //数据初始化
        this.empTrain = {
          id: "",
          name: "",
          participants: "",
          theme: "",
          lecturer: "",
          content: "",
          place: "",
          shareTime: ""
        }
        this.dialogVisible = true;
        this.dialogTitle = '添加员工培训';
      },
      showEditEmpTrainView(data) {
        this.dialogTitle = '修改员工培训';
        this.dialogVisible = true;
        this.empTrain.id = data.id;
        this.empTrain.name = data.name;
        this.empTrain.participants = data.participants;
        this.empTrain.theme = data.theme;
        this.empTrain.lecturer = data.lecturer;
        this.empTrain.content = data.content;
        this.empTrain.place = data.place;
        this.empTrain.shareTime = data.shareTime;
      },
      doAddEmpTrain() {
        if (this.empTrain.id) {
          console.log(this.empTrain.id)
          this.putRequest('/personnel/train/',this.empTrain).then(resp => {
            if (resp) {
              this.initEmpTrains();
              this.dialogVisible = false;
            }
          })
        } else {
          console.log(this.empTrain.id)
          this.postRequest('/personnel/train/',this.empTrain).then(resp => {
            if (resp) {
              this.initEmpTrains();
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