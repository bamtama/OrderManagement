import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import {Input, RadioGroup, Pagination, Button, Select, Option, MessageBox, Loading, Message, Dialog, DatePicker, Checkbox, Container, Aside, Menu, Submenu, Header, Dropdown, MenuItem, DropdownMenu, DropdownItem, MenuItemGroup, Main, Tabs, TabPane, Tag, Radio, Autocomplete, Footer, CheckboxGroup, Upload, Alert, Cascader, Popover, Switch, Badge, Breadcrumb, BreadcrumbItem, Tooltip} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Input)
Vue.use(Button)
Vue.use(RadioGroup)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Loading.directive)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Checkbox)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Header)
Vue.use(Dropdown)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Main)
Vue.use(Upload)
Vue.use(Radio)
Vue.use(Switch)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Autocomplete)
Vue.use(Footer)
Vue.use(CheckboxGroup)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Popover)
Vue.use(Badge)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Tooltip)
Vue.prototype.$loading = Loading.service


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true // ajax携带cookie

let user = localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')) : {user_id: 0}
let SYSER = []
SYSER[9001] = 'logined'
SYSER[9002] = 'no session'
let ERROR = []
ERROR[0] = '?'
ERROR[998] = 'not verified'
ERROR[999] = 'undefined'

let httpSendSave = {}
export default {
  user,
  ERROR,
  skey: 1,
  httpSendSave,
  mp3: null,
  alertList: {},
  get isModeSub () {
    return this.user.usermode === 1
  },
  alert (text, title, callback) {
    if (this.alertList[text]) return this.alertList[text]
    this.alertList[text] = MessageBox.alert(text, title || 'promot', {
      dangerouslyUseHTMLString: true,
      confirmButtonText: 'ok',
      callback: (action, instance) => {
        if (callback != null) callback(action)
        delete this.alertList[instance.message]
      }
    })
    return this.alertList[text]
  },
  confirm (text, title, callbackOK, callbackNo, okText, noText) {
    return MessageBox.confirm(text, title || 'confirm', {
      dangerouslyUseHTMLString: true,
      cancelButtonText: noText || 'cancel',
      confirmButtonText: okText || 'ok',
      callback: action => {
        if (action === 'confirm') {
          if (callbackOK != null) callbackOK()
        } else {
          if (callbackNo != null) callbackNo()
        }
      },
      closeOnClickModal: false
    })
  },
  showLoading (text, target) {
    Vue.$loading = Loading.service({fullscreen: true, target: arguments.length >= 2 ? target : null, text: text || 'loading...'})
  },
  hideLoading () {
    if (Vue.$loading) Vue.$loading.close()
  },
  /**
   * 快速提示
   * type：success/warning/info/error 默认success
   * @param text
   * @param type
   * @returns {*}
   */
  tip (text, type) {
    return type ? Message[type]({message: text, customClass: 'tipMessage'}) : Message.success({message: text, customClass: 'tipMessage'})
  },
  fakeHttpSend (callback) {
    setTimeout(function(){
      callback()
    }, 500)
  },
  /**
   * 通用接口调用
   * 该方法统一管理sys或code错误码(ERROR表)并弹出提示(后续回调函数不再执行)，回调函数内不用判断错误码
   * @param url
   * @param data
   * @param callback
   * @param method
   */
  httpSend (url, data, callback, method, forRun) {
    if (forRun === true) {
      this.mHttpSend(url, data, callback, method, forRun)
    } else if (forRun === 'debounce') {
      let _this = this
      if (httpSendSave[url]) {
        clearTimeout(httpSendSave[url])
        httpSendSave[url] = null
      }
      httpSendSave[url] = setTimeout(function () {
        _this.mHttpSend(url, data, callback, method, forRun)
      }, 100)
    } else {
      if (!forRun && httpSendSave[url] && new Date().getTime() - httpSendSave[url] < 100) {
        console.log('duplicate request in 100ms', url)
        return
      }
      httpSendSave[url] = new Date().getTime()
      this.mHttpSend(url, data, callback, method, forRun)
    }
  },
  mHttpSend (url, data, callback, method) {
    let _this = this
    if (!data) data = {}
    if (data.skey) data.skey = new Date().getTime()
    else data.skey = this.skey
    if (this.user.token) data.token = this.user.token
    Object.keys(data).forEach((k) => {
      if (data[k] == null || data[k] === undefined) delete data[k]
    })
    let transformRequest = (data) => {
      let ret = []
      for (let it in data) {
        ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]))
      }
      return ret.join('&')
    }
    method = method || 'post'
    axios({
      method: method,
      url: method.toLocaleLowerCase() === 'post' ? url : url + '?' + transformRequest(data),
      data: method.toLocaleLowerCase() === 'post' ? data : null
    }).then(response => {
      let d = response && response.data
      if (d) {
        if ('sys' in d && d.sys !== 0) {
          this.onSysMsgHandler(d.sys)
          return false
        } else if ('code' in d && d.code !== 0) {
          _this.hideLoading()
          _this.alert(d.code + ': ' + ERROR[d.code], '', function () {
            if (d.code === 1005) router.replace('/')
          })
          return false
        }
      } else if (d === 0) {
        _this.hideLoading()
        _this.alert('please login again', '', function () {
          router.replace('/')
        })
      }
      if (callback != null) callback('data' in d ? d.data : d)
    }, error => {
      _this.hideLoading()
      _this.alertUrlError(url, error, _this)
      console.log(url, error)
    })
  },
  alertUrlError (url, _error, _this) {
    let _t = url.split('/')
    _error = _error + ' ' + _t[_t.length - 2] + ' ' + _t[_t.length - 1]
    let _al = document.getElementById('alertURLMethod')
    let _alhtml = _al ? _al.innerHTML : ''
    if (_alhtml.indexOf(url)  >= 0) _error = _alhtml
    else if (_alhtml) _error = _alhtml + '<br>' + _error
    if (_al) _al.innerHTML = _error
    else _this.alert('Network exception, please check the network and try again<br><span style=\'width: 100%;font-size: 12px;opacity: 0.6;\' id=\'alertURLMethod\'>' + _error + '</span>')
  },
  onSysMsgHandler (code) {
    this.hideLoading()
    switch (code) {
      case 9000:
      case 9001:
      case 9003:
        if (this.user.user_id > 0) {
          this.user.user_id = 0
          this.alert(code + ': ' + SYSER[code] + ', close the pop-up window and back to the mainpage after 6 seconds')
          window.setTimeout(function () {
            router.push('/')
          }, 6000)
        } else {
          this.alert(code + ': ' + SYSER[code], 'unlogin', function () {
            router.push('/')
          })
        }
        break
    }
  },
  getUrlParam (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return r[2] + ''
    return null
  },
  getOffset (Node, offset) {
    if (!offset) {
      offset = {}
      offset.top = 0
      offset.left = 0
    }
    if (Node === document.body) {
      // 当该节点为body节点时，结束递归
      return offset
    }
    offset.top += Node.offsetTop
    offset.left += Node.offsetLeft
    return this.getOffset(Node.offsetParent, offset) // 向上累加offset里的值
  },
  dateFormat (date, format) {
    // 特殊验证转换：字符串格式为yyyy-MM-dd|yyyyMMdd
    let tmpd = null
    if (/^\d{8}|\d{4}-\d{2}-\d{2}$/.test(date)) {
      tmpd = date.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
    }
    if (tmpd !== null) {
      date = isNaN(new Date(tmpd).getTime()) ? '' : new Date(tmpd)
    }
    // 通用验证流程，date需为Date
    if (!date.getFullYear) return ''
    if (!format) format = 'yyyy-MM-dd hh:mm:ss'
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    let padLeftZero = (str) => {
      return ('00' + str).substr(str.length)
    }
    // 遍历这个对象
    for (let k in o) {
      if (new RegExp(`(${k})`).test(format)) {
        let str = o[k] + ''
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
      }
    }
    return format
  },
  // 保留X位小数，直接截掉：数字 保留位数 是否补0
  toFixed (num, leng, all) {
    if (isNaN(Number(num))) return num
    let numStr = num + ''
    let d = numStr.indexOf('.')
    if (d < 0) return num
    let c = numStr.substr(d + 1)
    if (c.length <= leng) {
      if (all) {
        let i = leng - c.length
        while (i > 0) {
          numStr += '0'
          i--
        }
        return numStr
      }
      return num
    }
    return numStr.substr(0, d + leng + 1)
  },
  // 转移敏感词
  formatScriptwords (txt) {
    return txt.replace(/<script/ig, '&lt;script').replace(/script>/ig, 'script&gt;')
  },
  emit (key, func) {
    window.eventHub.$emit(key, func)
  },
  on (key, func) {
    window.eventHub.$on(key, func)
  },
  off (key, func) {
    window.eventHub.$off(key, func)
  },
  getSliceGroup (data, count) {
    if (!data || data.length === 0) return null
    if (data.length <= count) return [data]
    let newArray = []
    let n = Math.ceil(data.length / count)
    for (let i = 0; i < n; i++) {
      newArray.push(data.slice(i * count, (i + 1) * count))
    }
    return newArray
  },
  isMatch (val, param) {
    // 规则为空
    if (param === undefined) return true
    if (typeof param === 'number') {
      let re
      switch (param) {
        case 0:
          // 数字且不为空
          re = /^\d{1,}$/
          break;
        case 1:
          // 字母和数字
          re = /^[A-Za-z0-9]+$/
          break;
        case 2:
          // 6~12位字母和数字组合
          re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
          break;
        case 3:
          // 最多两位小数
          re = /^[0-9]+(.[0-9]{2})?$/
          break;
        default:
          break;
      }
      return re.test(val)
    }
    return true
  }
}
