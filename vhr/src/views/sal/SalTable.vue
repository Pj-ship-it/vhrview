<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button icon="el-icon-plus" type="primary" @click="showAddSalView">新增</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initSal"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
              :data="sals"
              border
              stripe
              style="width: 100%">
        <el-table-column
                type="selection"
                align="left"
                width="55">
        </el-table-column>
        <el-table-column
                prop="date"
                label="日期"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="name"
                label="姓名"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="basePay"
                label="基本工资"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="deduction"
                label="缺勤扣款"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="insurance"
                label="社保"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="accFund"
                label="公积金"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                prop="perTax"
                label="个税"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                prop="netSalary"
                label="实发工资"
                align="center"
                width="180">
        </el-table-column>
        <el-table-column
                label="操作"
                align="center">
          <template slot-scope="scope">
            <el-button @click="showEditSalView(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteSal(scope.row)">删除</el-button>
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
      <el-form :model="sal">
        <el-form-item label="日期" :label-width="formLabelWidth" style="width: 80%">
          <el-date-picker
                  v-model="sal.date"
                  type="date"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  placeholder="日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="sal.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="基本工资" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="sal.basePay" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="缺勤扣款" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="sal.deduction" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="社保" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="sal.insurance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公积金" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="sal.accFund" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="个税" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="sal.perTax" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="实发工资" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="sal.netSalary" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddSal">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'SalTable',
    data() {
      return {
        dialogVisible: false,
        dialogTitle: '添加',
        sals: [],
        total: 0,
        currentPage: 1,
        currentSize: 10,
        sal: {
          id: "",
          date: "",
          name: "",
          basePay: "",
          deduction: "",
          insurance: "",
          accFund: "",
          perTax: "",
          netSalary: ""
        },
        formLabelWidth: '130px'
      }
    },
    mounted () {
      this.initSal();
    },
    methods: {
      sizeChange(size) {
        this.currentSize = size;
        this.initSal();
      },
      currentChange(page) {
        this.currentPage = page;
        this.initSal();
      },
      deleteSal(data) {
        this.$confirm('此操作将删除【' + data.name + '】工资记录，是否继续？','提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/salary/table/" + data.id).then(resp => {
            if (resp) {
              this.initSal();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      initSal() {
        this.getRequest("/salary/table/").then(resp => {
          if (resp) {
            this.sals = resp.data;
          }
        })
      },
      showAddSalView() {
        //数据初始化
        this.sal = {
          id: "",
          date: "",
          name: "",
          basePay: "",
          deduction: "",
          insurance: "",
          accFund: "",
          perTax: "",
          netSalary: ""
        }
        this.dialogVisible = true;
        this.dialogTitle = '新增';
      },
      showEditSalView(data) {
        this.dialogTitle = '修改';
        this.dialogVisible = true;
        this.sal.id = data.id;
        this.sal.date = data.date;
        this.sal.name = data.name;
        this.sal.basePay = data.basePay;
        this.sal.deduction = data.deduction;
        this.sal.insurance = data.insurance;
        this.sal.accFund = data.accFund;
        this.sal.perTax = data.perTax;
        this.sal.netSalary = data.netSalary;

      },
      doAddSal() {
        if (this.sal.id) {
          this.putRequest('/salary/table/',this.sal).then(resp => {
            if (resp) {
              this.initSal();
              this.dialogVisible = false;
            }
          })
        } else {
          this.postRequest('/salary/table/',this.sal).then(resp => {
            if (resp) {
              this.initSal();
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