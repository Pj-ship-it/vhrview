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
                prop="eid"
                label="员工编号"
                align="center"
                width="180">
        </el-table-column>
        <el-table-column
                prop="employee.name"
                label="姓名"
                align="center"
                width="180">
        </el-table-column>
        <el-table-column
                prop="trainDate"
                label="培训日期"
                align="center"
                width="180">
        </el-table-column>
        <el-table-column
                prop="trainContent"
                label="培训内容"
                align="center"
                width="180">
        </el-table-column>
        <el-table-column
                prop="remark"
                label="备注"
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
        <el-form-item label="id" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empTrain.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="eid" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empTrain.eid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="trainDate" :label-width="formLabelWidth" style="width: 80%">
          <el-date-picker
                  v-model="empTrain.trainDate"
                  type="date"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  placeholder="培训日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="trainContent" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empTrain.trainContent" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="remark" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empTrain.remark" autocomplete="off"></el-input>
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
        dialogTitle: '添加员工培训',
        empTrains: [],
        total: 0,
        currentPage: 1,
        currentSize: 10,
        empTrain: {
          id: "",
          eid: "",
          trainDate: "",
          trainContent: "",
          remark: ""
        },
        formLabelWidth: '120px'
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
        this.$confirm('此操作将删除【' + data.employee.name + '】培训记录，是否继续？','提示', {
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
        this.getRequest("/personnel/train/?page="+this.currentPage + '&size=' + this.currentSize).then(resp => {
          if (resp) {
            this.empTrains = resp.data;
            this.total = resp.total;
          }
        })
      },
      showAddEmpTrainView() {
        //数据初始化
        this.empTrain = {
          id: "",
          eid: "",
          trainDate: "",
          trainContent: "",
          remark: ""
        }
        this.dialogVisible = true;
        this.dialogTitle = '添加员工培训';
      },
      showEditEmpTrainView(data) {
        this.dialogTitle = '修改员工培训';
        this.dialogVisible = true;
        this.empTrain.id = data.id;
        this.empTrain.eid = data.eid;
        this.empTrain.trainDate = data.trainDate;
        this.empTrain.trainContent = data.trainContent;
        this.empTrain.remark = data.remark;
      },
      doAddEmpTrain() {
        if (this.empTrain.id) {
          this.putRequest('/personnel/train/',this.empTrain).then(resp => {
            if (resp) {
              this.initEmpTrains();
              this.dialogVisible = false;
            }
          })
        } else {
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