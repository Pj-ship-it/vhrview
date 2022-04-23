<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button icon="el-icon-plus" type="primary" @click="showAddEmpEcView">添加员工奖惩</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initEmpEcs"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
              :data="empEcs"
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
                width="150">
        </el-table-column>
        <el-table-column
                prop="employee.name"
                label="姓名"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                prop="ecDate"
                label="奖罚日期"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                prop="ecReason"
                label="奖罚原因"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                prop="ecPoint"
                label="奖罚分"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                prop="ecType"
                label="奖罚类型"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                prop="remark"
                label="备注"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                label="操作"
                align="center">
          <template slot-scope="scope">
            <el-button @click="showEditEmpEcView(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteEmpEc(scope.row)">删除</el-button>
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
      <el-form :model="empEc">
        <el-form-item label="id" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empEc.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="eid" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empEc.eid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="ecDate" :label-width="formLabelWidth" style="width: 80%">
          <el-date-picker
                  v-model="empEc.ecDate"
                  type="date"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  placeholder="培训日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="ecReason" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empEc.ecReason" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="ecPoint" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empEc.ecPoint" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="ecType" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empEc.ecType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="remark" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="empEc.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddEmpEc">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PerEc',
    data() {
      return {
        dialogVisible: false,
        dialogTitle: '添加员工奖惩',
        empEcs: [],
        total: 0,
        currentPage: 1,
        currentSize: 10,
        empEc: {
          id: "",
          eid: "",
          ecDate: "",
          ecReason: "",
          ecPoint: "",
          ecType: "",
          remark: ""
        },
        formLabelWidth: '120px'
      }
    },
    mounted () {
      this.initEmpEcs();
    },
    methods: {
      sizeChange(size) {
        this.currentSize = size;
        this.initEmpEcs();
      },
      currentChange(page) {
        this.currentPage = page;
        this.initEmpEcs();
      },
      deleteEmpEc(data) {
        this.$confirm('此操作将删除【' + data.employee.name + '】培训记录，是否继续？','提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          console.log(data)
          this.deleteRequest("/personnel/ec/" + data.id).then(resp => {
            if (resp) {
              this.initEmpEcs();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      initEmpEcs() {
        this.getRequest("/personnel/ec/?page="+this.currentPage + '&size=' + this.currentSize).then(resp => {
          if (resp) {
            this.empEcs = resp.data;
            this.total = resp.total;
          }
        })
      },
      showAddEmpEcView() {
        //数据初始化
        this.empEc = {
          id: "",
          eid: "",
          ecDate: "",
          ecReason: "",
          ecPoint: "",
          ecType: "",
          remark: ""
        }
        this.dialogVisible = true;
        this.dialogTitle = '添加员工奖惩';
      },
      showEditEmpEcView(data) {
        this.dialogTitle = '修改员工奖惩';
        this.dialogVisible = true;
        this.empEc.id = data.id;
        this.empEc.eid = data.eid;
        this.empEc.trainDate = data.trainDate;
        this.empEc.trainContent = data.trainContent;
        this.empEc.remark = data.remark;
      },
      doAddEmpEc() {
        if (this.empEc.id) {
          this.putRequest('/personnel/ec/',this.empEc).then(resp => {
            if (resp) {
              this.initEmpEcs();
              this.dialogVisible = false;
            }
          })
        } else {
          this.postRequest('/personnel/ec/',this.empEc).then(resp => {
            if (resp) {
              this.initEmpEcs();
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