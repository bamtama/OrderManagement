// ----------------------------
// socket通信类
// ----------------------------
import Vue from 'vue'
// 消息类型
let MESSAGE_TYPE = {LOGIN: 1, HEART: 2, SEND_MSG: 3, MSG_COUNT: 4}

let OUT_ERROR = {}
OUT_ERROR[1000] = 'Your account has been logged in to other places, please pay attention to security'
OUT_ERROR[1001] = 'Login timeout, please login again'

// socket通信类
export default {
  get C () { return Vue.prototype.C },
  get SOCKET_URL () { return Vue.prototype.SOCKET_URL },
  connect: function (isReconnect) {
    this.log_send('connecting')
    let _this = this
    this.connected = this.logined = false
    this.isFirst = true
    this.winAlert = null
    if (!isReconnect) {
      this.count = 0
      this.timeRe = setTimeout(this.reconnection.bind(this), 20000) // 重连计时器
    } // 重连次数
    this.MAX = 5 // 重连最大次数
    this.isReconnect = isReconnect // 本次连接是否属于重连

    this.socket = new WebSocket(this.SOCKET_URL)
    this.socket.onclose = this.connect_close.bind(this)
    this.socket.onopen = this.connect_result.bind(this)
    this.socket.onerror = this.connect_error.bind(this)
    this.socket.onmessage = function (evt) {
      if (evt.data === 'xxx') {
        _this.close()
      } else {
        _this.on_msg(evt.data)
      }
    }
    console.log('this.socket', this.socket)
  },
  // 通用发出消息
  send: function (data) {
    if (!this.connected) return
    this.socket.send(JSON.stringify(data))
  },
  // 发送心跳
  send_heart: function () {
    this.send({cmd: MESSAGE_TYPE.HEART, uid: this.C.user.user_id, token: this.C.user.token})
    this.log_send('hearting')
  },
  // 监听连接结果返回
  connect_result: function () {
    this.log_get('connect success')
    this.connected = true
    this.login()
  },
  // 监听到连接错误
  connect_error: function (msg) {
    this.C.tip('Message service connection error', 'error')
    this.log_get('Server connection error', msg)
    this.logined = false
  },
  // 监听到被关闭
  connect_close: function (msg) {
    this.C.tip('Message service connection lost', 'error')
    this.log_get('Server closed', msg)
    this.logined = false
    if (this.connected || this.isReconnect) this.reconnection()
  },
  // 关闭
  close: function () {
    if (!this.socket) return
    this.connected = this.logined = false
    this.socket.onclose = null
    this.socket.onopen = null
    this.socket.onerror = null
    this.socket.onmessage = null
    this.C.tip('Message service connection lost', 'error')
    this.log_send('closed')
    clearTimeout(this.timeRe)
    clearInterval(this.heart)
    this.socket.close()
    this.socket = null
  },
  // 重连机制
  reconnection: function () {
    this.count = this.count + 1
    console.log('reconnection...【' + this.count + '】')
    // 1与服务器已经建立连接
    if (this.count >= this.MAX || this.logined) {
      if (this.count >= this.MAX && !this.logined) {
        clearInterval(this.heart)
      }
      clearTimeout(this.timeRe)
    } else {
      this.connected = this.logined = false
      this.connect(true)
      clearTimeout(this.timeRe)
      this.timeRe = setTimeout(this.reconnection.bind(this), 20000) // 设置个重连过期时间20秒
    }
  },
  // 发出：登录
  login: function () {
    if (this.logined) return
    this.user_id = this.C.user.user_id
    this.send({cmd: MESSAGE_TYPE.LOGIN, uid: this.user_id, token: this.C.user.token, user_acc: this.C.user.username, acc_type: this.C.user.acc_type})
    this.log_send('login', this.user_id, this.C.user.token)
  },
  // 收到：登录返回
  login_result: function (msg) {
    this.C.tip('Message service connection success', 'success')
    this.log_get('login', msg)
    this.logined = true
    this.count = 0
    clearTimeout(this.timeRe)
    if (this.heart) clearInterval(this.heart)
    this.heart = setInterval(this.send_heart.bind(this), 10 * 1000) // 每10s发送心跳
  },
  // 发送站内信
  sendMsg: function (to, title, content) {
    if (!this.logined) {
      this.C.alert('Message service connection lost')
      return
    }
    this.send({cmd: MESSAGE_TYPE.SEND_MSG, uid: this.user_id, token: this.C.user.token, user_acc: this.C.user.username, acc_type: this.C.user.acc_type, to: to, title: title, content: content})
    this.log_send('message sending', to, title)
  },
  // 收到消息
  on_msg: function (msg) {
    if (typeof msg !== 'object') msg = JSON.parse(msg)
    this.formatMsg(msg)
  },
  // 处理消息
  formatMsg: function (msg) {
    switch (msg.cmd) {
      case MESSAGE_TYPE.LOGIN: // 登录返回
        if (msg.status === 1) this.login_result()
        else {
          this.close()
        }
        break
      case MESSAGE_TYPE.SEND_MSG: // 发送站内信反馈
        window.eventHub.$emit('MessageTip', msg)
        break
      case MESSAGE_TYPE.MSG_COUNT: // 站内信未读消息数量
        window.eventHub.$emit('MessageCount', msg)
        break
      default:
        this.log_get('unknown message', msg)
        break
    }
  },
  log_send: function (str, msg) {
    let time = this.C.dateFormat(new Date())
    console.log('%c[send]' + str, 'color:blue', msg || '', time)
  },
  log_get: function (str, msg) {
    let time = this.C.dateFormat(new Date())
    console.log('%c[received]' + str, 'color:green', msg || '', time)
  }
}
