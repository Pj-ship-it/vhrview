<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button icon="el-icon-plus" type="primary" @click="showAddAdjustView">新增</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initAdjust"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
              :data="adjusts"
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
                label="工号"
                align="center"
                width="60">
        </el-table-column>
        <el-table-column
                prop="name"
                label="姓名"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="idCard"
                label="身份证号码"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="changeProperty"
                label="异动性质"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="originPost"
                label="原岗位名称"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
                prop="newPost"
                label="现岗位名称"
                align="center"
                width="110">
        </el-table-column>
        <el-table-column
              prop="adjustReason"
              label="调薪原因"
              align="center"
              width="110">
      </el-table-column>
        <el-table-column
              prop="beforeSalary"
              label="调前工资"
              align="center"
              width="110">
      </el-table-column>
        <el-table-column
              prop="afterSalary"
              label="调后工资"
              align="center"
              width="110">
      </el-table-column>
        <el-table-column
                label="操作"
                align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showEditAdjustView(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteAdjust(scope.row)">删除</el-button>
          </template>

        </el-table-column>
      </el-table>

    </div>
    <el-dialog :title=dialogTitle :visible.sync="dialogVisible">
      <el-form :model="adjust">
        <el-form-item label="id" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="adjust.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工编号" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="adjust.eid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="adjust.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="adjust.idCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="异动性质" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="adjust.changeProperty" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="原岗位名称" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="adjust.originPost" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="现岗位名称" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="adjust.newPost" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="调薪原因" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="adjust.adjustReason" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="调前工资" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="adjust.beforeSalary" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="调后工资" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="adjust.afterSalary" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddAdjust">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PerAdjust',
    data() {
      return {
        dialogVisible: false,
        dialogTitle: '新增',
        adjusts:[],
        adjust: {
          id: undefined,
          name: undefined,
          idCard: undefined,
          eid: undefined,
          changeProperty: undefined,
          originPost: undefined,
          newPost: undefined,
          adjustReason: undefined,
          beforeSalary: undefined,
          afterSalary: undefined
        },
        formLabelWidth: '120px'
      }
    },
    mounted () {
      this.initAdjust();
    },
    methods: {
      deleteAdjust(data) {
        this.$confirm('此操作将删除【' + data.name + '】培训记录，是否继续？','提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          console.log(data)
          this.deleteRequest("/personnel/adjust/" + data.id).then(resp => {
            if (resp) {
              this.initAdjust();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      initAdjust() {
        this.getRequest("/personnel/adjust/").then(resp => {
          if (resp) {
            this.adjusts = resp.data;
          }
        })
      },
      showAddAdjustView() {
        //数据初始化
        this.adjust = {
          id: "",
          name: "",
          idCard: "",
          eid: "",
          changeProperty: "",
          originPost: "",
          newPost: "",
          adjustReason: "",
          beforeSalary: "",
          afterSalary: ""
        }
        this.dialogVisible = true;
        this.dialogTitle = '新增';
      },
      showEditAdjustView(data) {
        this.dialogTitle = '编辑';
        this.dialogVisible = true;
        this.adjust.id = data.id;
        this.adjust.name = data.name;
        this.adjust.idCard = data.idCard;
        this.adjust.eid = data.eid;
        this.adjust.changeProperty = data.changeProperty;
        this.adjust.originPost = data.originPost;
        this.adjust.newPost = data.newPost;
        this.adjust.adjustReason = data.adjustReason;
        this.adjust.beforeSalary = data.beforeSalary;
        this.adjust.afterSalary = data.afterSalary;
      },
      doAddAdjust() {
        if (this.adjust.id) {
          console.log(this.adjust.id)
          this.putRequest('/personnel/adjust/',this.adjust).then(resp => {
            if (resp) {
              this.initAdjust();
              this.dialogVisible = false;
            }
          })
        } else {
          this.postRequest('/personnel/adjust/',this.adjust).then(resp => {
            if (resp) {
              this.initAdjust();
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