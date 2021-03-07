<template>
  <div class="page_content">
    <chead></chead>
    <div class="content">
      <div class="contenthead">
        <datePick :deTimeType = '0' @change="time_change"></datePick>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" plain class="fr" icon="el-icon-plus" @click="onNewPersonalNotice(1)">添加个人公告</el-button>
        <el-button type="primary" plain class="fr" icon="el-icon-plus" @click="onAddClick">添加系统公告</el-button>
        <el-button type="primary" plain class="fr" icon="el-icon-plus" @click="onNewActivityNotice">添加活动公告</el-button>
      </div>
      <div class="contentbody">
        <table class="table_style">
          <thead>
            <tr>
              <th>ID</th>
              <th>状态</th>
              <th>标题</th>
              <th>内容</th>
              <th>发布者</th>
              <th>公告类型</th>
              <th>时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="index" v-for="(item, index) in dataLists">
              <td v-text="item.id">2</td>
              <td>
                <mStatus :active="item.status" values="2,1" labels="正常,禁用" :params="{id: item.id}" @change="onChangeStatus"></mStatus>
              </td>
              <td>
                <span v-text="item.title"></span>
              </td>
              <td class="maxwidth">
                <span v-text="item.content"></span>
              </td>
              <td v-text="item.creater">service</td>
              <td v-text="noticetype[item.notice_type]">service</td>
              <td v-text="item.log_time">service</td>
              <td>
                <el-button type="warning" @click="onDelNotice(item)">删除</el-button>
                <el-button type="primary" v-show="item.notice_type === 3" @click="onEditActivityNotice(item)">详情</el-button>
              </td>
            </tr>
          </tbody>
        </table>
        <el-alert v-show="dataLists && dataLists.length === 0"
                  title="暂无数据"
                  type="warning"
                  center
                  show-icon :closable="false">
        </el-alert>
      </div>
      <pagination @change="pagination_change" :page='1' :pageSize='20' :total='recordsTotal'></pagination>
    </div>
    <el-dialog class="flex_dialog" title="添加系统公告" :visible.sync="onAddNotices" width="600px">
      <div class="dialogdiv">
        <span>标题：</span>
        <el-input v-model="e_title" placeholder="请输入内容"></el-input>
      </div>
      <div class="dialogdiv">
        <span>内容：</span>
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="e_content">
      </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button class="fl" @click="reset">重 置</el-button>
      <el-button @click="onAddNotices = false">取 消</el-button>
      <el-button type="primary" @click="onAddConfirmClick">添 加</el-button>
    </span>
    </el-dialog>
    <el-dialog class="stje" title="添加个人公告" :visible.sync="onAddNotices2" width="600px">
      <div class="dialogdiv">
        <span>标题：</span>
        <el-input style="width:400px" v-model="e_title" placeholder="请输入内容"></el-input>
      </div>
      <div class="dialogdiv">
        <span>内容：</span>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="e_content">
        </el-input>
      </div>
      <div class="dialogdiv">
        <span>选择会员：</span>
        <el-radio v-model="mems" label="1">全部会员</el-radio>
        <el-radio v-model="mems" label="2">指定会员</el-radio>
      </div>
      <div class="dialogdiv" v-show="mems == '2'">
        <span></span>
        <el-select
          v-model="memsvalue2"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词搜索"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onAddNotices2 = false">取 消</el-button>
        <el-button type="primary" @click="onAddConfirmClick2">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="flex_dialog" title="添加个人公告" :visible.sync="showPersonalNotice" width="600px">
      <template v-if="cpNoticeInfo.step != 2">
        <div class="dialogdiv">
          <span>标题：</span>
          <el-input v-model="cpNoticeInfo.title" placeholder="请输入内容"></el-input>
        </div>
        <div class="dialogdiv">
          <span class="aligntop">内容：</span>
          <el-input v-model="cpNoticeInfo.content" type="textarea" :rows="10" placeholder="请输入内容"></el-input>
        </div>
      </template>
      <template v-else>
        <div class="dialogdiv">
          <span>经销商：</span>
          <el-input ></el-input>
        </div>
        <div class="dialogdiv">
          <span>会员查询：</span>
          <el-input v-model="cpNoticeInfo.user_acc"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="onNewPersonalNoticeSearch">查询</el-button>
        </div>
        <div class="dialogdiv">
          <span class="aligntop">查询结果：</span>
          <div class="cont">
            <el-checkbox-group style="min-height: 80px" v-model="cpNoticeInfo.user_ids">
              <el-checkbox v-for="(li, i) in cpNoticeInfo.user_accarr" :label="li" :key="`user_${i}`">{{li.user_acc}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="dialogdiv">
          <span class="aligntop">发送会员：</span>
          <div class="cont" style="min-height: 80px">
            <el-tag v-for="(li, i) in cpNoticeInfo.user_ids" :key="`user_s_${i}`" size="mini" @close="handleClose(li)" closable>{{li.user_acc}}</el-tag>
          </div>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPersonalNotice = false">取 消</el-button>
        <el-button type="primary" @click="onNewPersonalNoticeNext">{{cpNoticeInfo.step != 2 ? '下一步' : '确定'}}</el-button>
      </span>
    </el-dialog>
    <el-dialog class="flex_dialog" :title="actNoticeInfo.isedit? '活动公告详情': '添加活动公告'" :visible.sync="showActivityNotice" width="640px">
      <div class="dialogdiv">
        <span>名称：</span>
        <el-input :disabled="actNoticeInfo.isedit? 'disabled': false" v-model="actNoticeInfo.title"></el-input>
      </div>
      <table class="table_style excel mb10">
        <thead>
          <tr><th></th><th>PC端</th><th>手机端</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>标题</td>
            <td><imageUploader :list="actNoticeInfo.pc_title" title="标题" @change="onImageChange($event, 'pc_title')" width="220" height="36"></imageUploader></td>
            <td><imageUploader :list="actNoticeInfo.wap_title" title="标题" @change="onImageChange($event, 'wap_title')" width="220" height="36"></imageUploader></td>
          </tr>
          <tr>
            <td>内容</td>
            <td><imageUploader :list="actNoticeInfo.pc_content" title="内容" @change="onImageChange($event, 'pc_content')" width="220" height="100"></imageUploader></td>
            <td><imageUploader :list="actNoticeInfo.wap_content" title="内容" @change="onImageChange($event, 'wap_content')" width="220" height="100"></imageUploader></td>
          </tr>
        </tbody>
      </table>
      <div class="m_tip">
        <p>提示：</p>
        <p>xxxx</p>
        <p>xxxxxxxxxx</p>
        <p>xxxxxxxxxxxxxxxxxxxx</p>
        <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showActivityNotice = false">取 消</el-button>
        <el-button type="primary" @click="onActivityNoticeSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import chead from '@/module/contentHead.vue'
import datePick from '@/module/datePicker.vue'
import pagination from '@/module/Pagination.vue'
import mStatus from '@/module/mStatus'
import imageUploader from '@/module/imageUploader'
export default {
  components: {
    chead,  datePick, pagination, mStatus, imageUploader
  },
  name: 'dash',
  data () {
    return {
      onAddNotices: false,
      onAddNotices2: false,
      data: {
        page: 1,
        perPage: 20,
        start_date: this.C.dateFormat(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
        end_date: this.C.dateFormat(new Date(), 'yyyy-MM-dd') + ' 23:59:59'
      },
      e_title: '',
      e_content: '',
      path: 'admin',
      memberList: [],
      noticetype: ['', '系统公告', '个人公告', '活动公告'],
      sendnotye: 1,
      dataLists: null,
      recordsTotal: 0,
      idsname: '全部',
      mems: 2,
      options: [],
      memsvalue2: [],
      thelist: [],
      loading: false,
      showPersonalNotice: false,
      cpNoticeInfo: {},
      showActivityNotice: false,
      actNoticeInfo: {}
    }
  },
  mounted () {
    this.search()
  },
  watch: {
  },
  computed: {
  },
  methods: {
    onAddClick: function () {
      let _self = this
      _self.e_title = ''
      _self.e_content = ''
      _self.sendnotye = 1
      _self.onAddNotices = true
    },
    onAddClick2: function () {
      let _self = this
      _self.e_title = ''
      _self.e_content = ''
      _self.sendnotye = 2
      _self.mems = '2'
      _self.memsvalue2 = []
      _self.thelist = []
      _self.options = []
      _self.onAddNotices2 = true
    },
    reset: function () {
      this.e_title = ''
      this.e_content = ''
    },
    time_change (time) {
      this.data.start_date = time[0]
      this.data.end_date = time[1]
      this.search()
    },
    pagination_change (p) {
      console.log(p)
      this.data.perPage = p.pageSize
      this.data.page = p.page
      this.search()
    },
    onChangeStatus (data) {
      if (data) {
        this.search(1)
      }
    },
    onAddConfirmClick () {
    },
    onAddConfirmClick2 () {
      this.onAddConfirmClick3()
    },
    remoteMethod (query) {
      let _self = this
      if (query !== '') {
        this.loading = true
        this.C.httpSend('/member/search_user_by_name',
          {user_acc: query, aid: _self.aid, gid: _self.gid, cid: _self.cid}, function (json) {
            if (json) {
              console.log(json)
              _self.memberList = json
              _self.thelist = _self.memberList.map(item => {
                return { name: `${item.user_acc}`, id: `${item.id}` }
              })
              _self.options = _self.thelist.filter(item => {
                return item.name.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1
              })
              _self.loading = false
            }
            _self.C.hideLoading()
          }, 'get')
      } else {
        this.options = []
      }
    },
    onAddConfirmClick3 () {
      console.log(this.memsvalue2)
      let _self = this
      if (_self.memsvalue2.length === 0 && _self.mems === '2') {
        _self.C.alert('请指定会员！ \n')
        return
      }
      this.C.showLoading('数据加载中')
      this.C.httpSend('/notices/create_notices', {
      }, function (json) {
        if (json === 0) {
          _self.C.tip('添加成功')
          _self.search(1)
          _self.onAddNotices2 = false
        }
        _self.C.hideLoading()
      }, 'post')
    },
    search () {
    },
    onNewPersonalNotice (ismode) {
      if (ismode) {
        this.cpNoticeInfo = {
          notice_type:2,
          title: '',
          content: '',
          user_acc: '',
          user_accarr: [],
          user_ids: [],
          step: 1,
        }
        this.showPersonalNotice = true
      } else {
        this.onAddClick2()
      }
    },
    handleClose(li) {
      this.cpNoticeInfo.user_ids.splice(this.cpNoticeInfo.user_ids.indexOf(li), 1);
    },
    onNewPersonalNoticeNext () {
      
    },
    onNewPersonalNoticeSearch  () {
      
    },
    onNewActivityNotice () {
      // 算一下序号，填入
      this.actNoticeInfo = {
        title: '',
        pc_title: [],
        pc_content: [],
        wap_title: [],
        wap_content: [],
        isedit: false
      }
      // 添加活动公告
      this.showActivityNotice = true
    },
    onImageChange (data, key) {
      // 图片数据更新，根据实际情况处理
      this.actNoticeInfo[key] = data
    },
    onActivityNoticeSubmit () {
      // 提交活动公告信息
      let _self = this
      if (this.actNoticeInfo.title === '') {
        _self.C.alert('请输入活动名称！ \n')
        return
      }
      if (this.actNoticeInfo.pc_title.length === 0) {
        _self.C.alert('请输入PC端标题！ \n')
        return
      }
      if (this.actNoticeInfo.pc_content.length === 0) {
        _self.C.alert('请输入PC端内容！ \n')
        return
      }
      if (this.actNoticeInfo.isedit &&
        !(this.actNoticeInfo.pc_title[0].raw ||
        this.actNoticeInfo.pc_content[0].raw ||
        (this.actNoticeInfo.wap_title && this.actNoticeInfo.wap_title[0].raw) ||
        (this.actNoticeInfo.wap_content && this.actNoticeInfo.wap_content[0].raw))) {
          // 编辑未修改
          _self.showActivityNotice = false
          return
      }
      let formdata = new FormData()
      console.log(this.actNoticeInfo.pc_title[0].raw)
      if (this.actNoticeInfo.pc_title[0] && this.actNoticeInfo.pc_title[0].raw) {
        formdata.append('pc_title', this.actNoticeInfo.pc_title[0].raw)
      }
      if (this.actNoticeInfo.pc_content[0] && this.actNoticeInfo.pc_content[0].raw) {
        formdata.append('pc_content', this.actNoticeInfo.pc_content[0].raw)
      }
      if (this.actNoticeInfo.wap_title[0] && this.actNoticeInfo.wap_title[0].raw) {
        formdata.append('wap_title', this.actNoticeInfo.wap_title[0].raw)
      }
      if ( this.actNoticeInfo.wap_content[0] && this.actNoticeInfo.wap_content[0].raw) {
        formdata.append('wap_content', this.actNoticeInfo.wap_content[0].raw)
      }
      console.log(formdata)
      let reqdata = {
        title: this.actNoticeInfo.title,
        notice_type: 3,
        id: this.actNoticeInfo.id
      }
      this.C.showLoading()
      axios({
        method: 'post',
        config: {headers: {'Content-Type': 'multipart/form-data'}},
        url: this.HTTP_HOST_LOT + '/notices/create_notices',
        data: formdata,
        skey: 1,
        params: reqdata
      }).then((response) => {
        let d = response && response.data
        this.C.hideLoading()
        if (d.data === 0) {
          _self.C.tip('success')
          _self.showActivityNotice = false
        }
      }).catch((error) => {
        this.C.hideLoading()
        this.C.alert(error)
      })
    },
    onEditActivityNotice (item) {
      // 填入活动公告信息
      this.actNoticeInfo = {
        title: item.title,
        files_url: item.files_url,
        notice_type: item.notice_type,
        pc_title: [{url:this.path + `/static/images/event` + item.files_url.pc_title}],
        pc_content: [{url:this.path + `/static/images/event` + item.files_url.pc_content}],
        id: item.id,
        isedit: true
      }
      if(item.files_url.wap_title){
        this.actNoticeInfo.wap_title = [{url:this.path + `/static/images/event` + item.files_url.wap_title}]
      }
      if(item.files_url.wap_content ){
        this.actNoticeInfo.wap_content = [{url:this.path + `/static/images/event` + item.files_url.wap_content}]
      }
      console.log(this.actNoticeInfo)
      this.showActivityNotice = true
    },
    onDelNotice (item) {
      this.C.confirm('确认删除该条信息 ？', null, () => {
        let _self = this
        this.C.showLoading('数据加载中')
        this.C.httpSend('/notices/delete_notices', {
          id: item.id,
          notice_type: item.notice_type
        }, function (json) {
          if (json === 0) {
            _self.C.tip('操作成功')
            _self.search()
          }
          _self.C.hideLoading()
        }, 'post')
      })
    }
  }
}
</script>
<style lang="less">
</style>
