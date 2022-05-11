<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button icon="el-icon-plus" type="primary" @click="showAddMeetingRoomView">新增</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initMeetingRoom"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
              :data="meetingRooms"
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
                label="名称"
                align="center"
                width="230">
        </el-table-column>
        <el-table-column
                prop="place"
                label="位置"
                align="center"
                width="230">
        </el-table-column>
        <el-table-column
                prop="capacity"
                label="容纳人数"
                align="center"
                width="230">
        </el-table-column>
        <el-table-column
                prop="scale"
                label="规模"
                align="center"
                width="230">
        </el-table-column>
        <el-table-column
                label="操作"
                align="center">
          <template slot-scope="scope">
            <el-button @click="showEditMeetingRoomView(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteMeetingRoom(scope.row)">删除</el-button>
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
      <el-form :model="meetingRoom">
        <el-form-item label="名称" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="meetingRoom.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="meetingRoom.place" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="容纳人数" :label-width="formLabelWidth" style="width: 80%">
          <el-input v-model="meetingRoom.capacity" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规模" :label-width="formLabelWidth" style="width: 80%">
          <el-select v-model="meetingRoom.scale" placeholder="请选择">
            <el-option
                    v-for="item in options"
                    :key="item.scale"
                    :label="item.label"
                    :value="item.scale">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddMeetingRoom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'MetRoom',
    data() {
      return {
        dialogVisible: false,
        dialogTitle: '新增',
        meetingRooms:[],
        meetingRoom: {
          id: "",
          name: "",
          place: "",
          capacity: "",
          scale: ""
        },
        formLabelWidth: '120px',
        options: [{
          scale: '小型',
          label: '小型'
        }, {
          scale: '中型',
          label: '中型'
        }, {
          scale: '大型',
          label: '大型'
        }],
        scale: ''
      }
    },
    mounted () {
      this.initMeetingRoom();
    },
    methods: {
      deleteMeetingRoom(data) {
        this.$confirm('此操作将删除【' + data.name + '】会议室，是否继续？','提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/meeting/meetingroom/" + data.id).then(resp => {
            if (resp) {
              this.initMeetingRoom();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      initMeetingRoom() {
        this.getRequest("/meeting/meetingroom/").then(resp => {
          if (resp) {
            this.meetingRooms = resp.data;
          }
        })
      },
      showAddMeetingRoomView() {
        //数据初始化
        this.meetingRoom = {
          id: "",
          name: "",
          place: "",
          capacity: "",
          scale: ""
        }
        this.dialogVisible = true;
        this.dialogTitle = '新增';
      },
      showEditMeetingRoomView(data) {
        this.dialogTitle = '修改';
        this.dialogVisible = true;
        this.meetingRoom.id = data.id;
        this.meetingRoom.name = data.name;
        this.meetingRoom.place = data.place;
        this.meetingRoom.capacity = data.capacity;
        this.meetingRoom.scale = data.scale;
      },
      doAddMeetingRoom() {
        if (this.meetingRoom.id) {
          this.putRequest('/meeting/meetingroom/',this.meetingRoom).then(resp => {
            if (resp) {
              this.initMeetingRoom();
              this.dialogVisible = false;
            }
          })
        } else {
          this.postRequest('/meeting/meetingroom/',this.meetingRoom).then(resp => {
            if (resp) {
              this.initMeetingRoom();
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