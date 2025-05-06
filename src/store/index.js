
import { createStore  } from 'vuex';
import screenfull from 'screenfull';

const store = createStore({
  state() {
    return {
      userInfo:JSON.parse(localStorage.getItem('onlineUser') || '{}'), // 当前登录在线的用户信息 只有账号密码
      playerInfo:JSON.parse(localStorage.getItem('playerInfo') || '{}'),  // 存放所有玩家信息 （金币、积分、钻石、信息）对象形式
      playList:[], // 存放所有登录玩家信息 数组形式
      isFullscreen: false, // 是否全屏
      Number:1,
      audio: null, // 存储音频对象
      isPlaying: false, // 存储音频是否正在播放的状态
    };
  },
  mutations: {
    setUser(state, userInfo) {
      state.userInfo = userInfo;
    },
    moveUser(state) {
      state.userInfo = {};
    },
    getPlayList(state) {
      const data = [];
      const playerInfo = JSON.parse(localStorage.getItem('playerInfo') || '{}');
      Object.keys(playerInfo).forEach(key => {
        if(typeof playerInfo[key] === 'object' && playerInfo[key] !== null){
            data.push({
              account: key,
              name: playerInfo[key].name,
              score: playerInfo[key].score,
              level: playerInfo[key].level,
              money: playerInfo[key].money
            })
        }
      });
      state.playList = data;
      return data;
    },
    SET_FULLSCREEN(state, value) {
      state.isFullscreen = value;
    },
    // 更新当前玩家信息 （金币、积分、钻石、信息）传入一个userInfo对象 {username:xxx, money:xxx, score:xxx, level:xxx, name:xxx}
    updatePlayer(state, onLineUser) {
      let playerInfo = JSON.parse(localStorage.getItem('playerInfo') || '{}');
      let newPlayerInfo = playerInfo[onLineUser.username];
      if(newPlayerInfo && newPlayerInfo.username === onLineUser.username && newPlayerInfo.password === onLineUser.password){
        playerInfo[onLineUser.username] = onLineUser;
        localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
        state.playerInfo = playerInfo;
      }
    },
    // 播放音频
    playAudio(state, audio) {
      if (state.audio) {
        state.audio.pause && state.audio.pause();
        state.isPlaying = false;
      }
      state.audio = audio;
      state.audio.play && state.audio.play();
      state.isPlaying = true;
    },
    // 暂停音频
    pauseAudio(state) {
      if (state.audio) {
        state.audio.pause();
        state.isPlaying = false;
      }
    },
  },
  actions: {
    // 全屏 使用vuex统一管理
    toggleFullscreen({ commit }) {
      if (screenfull.isEnabled) {
        screenfull.toggle().then(() => {
          commit('SET_FULLSCREEN', screenfull.isFullscreen);
        });
      }
    },
    enterFullscreen({ commit }) {
      if (screenfull.isEnabled) {
        screenfull.request().then(() => {
          commit('SET_FULLSCREEN', true);
        });
      }
    },
    exitFullscreen({ commit }) {
      if (screenfull.isEnabled) {
        screenfull.exit().then(() => {
          commit('SET_FULLSCREEN', false);
        });
      }
    },
    // 跟新当前玩家信息
    updatePlayerInfo({ commit }, onLineUser) {
      commit('updatePlayer', onLineUser);
    },
    // 游戏声音
    playAudio({ commit }, audio) {
      commit('playAudio', audio);
    },
  },
  getters: {
    isFullscreen: (state) => state.isFullscreen,
     // 获取当前在线玩家信息 （金币、积分、钻石、信息） 只能通过这种方式获取 返回一个对象
     getOnlineUser: (state) =>  { 
       return {
        ...state.playerInfo[state.userInfo.username],
        money: state.playerInfo[state.userInfo.username]?.money || 0,
        score: state.playerInfo[state.userInfo.username]?.score || 0,
        diam: state.playerInfo[state.userInfo.username]?.diam || 0,
       }
     },
  },
});

export default store;