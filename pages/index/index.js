//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log("res=" + res);
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log("e="+e)
    app.globalData.userInfo = e.detail.userInfo;
    wx.login({
      success: function (res) {
        //获取登录的临时凭证
        var code = res.code;
        //调用后端，获取微信的session_key, secret
        var loginUrl = app.globalData.url;
        wx.request({
          url: loginUrl+'/wxLogin?code=' + code,
          data: e.detail.userInfo,
          method: 'POST',
          success: function (result) {
            var openId = result.data.data;
            wx.setStorageSync("openId", openId);
          }
        })
      }
    })
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  click: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        var questionCode = res.result;
        var openId = wx.getStorageSync("openId");
        var releUrl = app.globalData.url;
        wx.request({
          url: releUrl+'/releQuenaire?openId=' + openId + '&queCode=' + questionCode,
          method: 'POST',
          success: function (result) {
            var r = result.data;
            if (r.status=='200'){
              var questionnaire = result.data.data;
              wx.setStorageSync("quesiotnnaireId", questionnaire.id);
              wx.navigateTo({
                url: '../wjdc/wjdc',
              })
            } else if (r.status == '1'){
              wx.showToast({
                title: r.msg,
                icon: 'none',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: '系统繁忙，稍后再试',
                icon: 'none',
                duration: 2000
              })
            }
            
          }
        })
        
        
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  wjdc: function () {
    wx.navigateTo({
      url: '../wjdc/wjdc',
    })
  }
})
