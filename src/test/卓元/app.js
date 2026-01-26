import config from "common/config";
import { get } from "common/request";
import router from "../../router";
import routes from "../../router/routes";
import { getAsyncRoutes2 } from "common/tools";
import cookieUtil from "../../common/cookie-util";
// import api from '@/api'

const getAsyncRoutes1 = (asyncMenuList = [], prefix) => {
  asyncMenuList.forEach((item) => {
    item.path = prefix + item.path;
    if (item.children?.length > 0) {
      getAsyncRoutes1(item.children, prefix);
    }
  });
  return asyncMenuList;
};

// const home = {
//   path: "/info",
//   meta: {
//     keepAlive: false,
//     icon: "home",
//     title: "首页",
//     menuSource: "czkj",
//   },
//   id: "251",
// };

const app = {
  namespaced: true,
  state: {
    userInfo: null,
    tagList: [],
    menuList: [],
    menu: [],
    loginStatus: "1",
    userId: "",
    buttons: [],
    dataRule: [],
    tabList: [],
    functionId: "",
    newPath: {},
    interfaceData: {}, // 系统参数信息
    pathRouteMap: {},
    menuKey: new Date().getTime()
  },
  getters: {
    userInfo: (state) => state.userInfo,
    tagList: (state) => {
      // 将首页置前
      const homeTagIndex = state.tagList.findLastIndex(
        (tag) => {
          if (tag.fullPath.indexOf('?') !== -1) {
            return tag.fullPath.split("?")[0] === config.homePath;
          }
          return tag.fullPath === config.homePath
        }
      );
      if (homeTagIndex > -1) {
        const homeTag = state.tagList.splice(homeTagIndex, 1);
        state.tagList = state.tagList.filter(item => item.title !== '首页')
        state.tagList.unshift(...homeTag);
      }
      return state.tagList;
    },
    menuList: (state) => {
      return state.menuList;
    },
    menuListKeep: (state) => {
      const result = []
      
      function traverse(items) {
        items.forEach(item => {
          // 检查当前项
          if (item.meta?.keepAlive && item.path) {
            result.push(item.path)
          }
          
          // 递归检查子项
          if (item.children && item.children.length > 0) {
            traverse(item.children)
          }
        })
      }
      
      traverse(state.menu)
      return result
    },
    menu: (state) => state.menu,
    loginStatus: (state) => state.loginStatus,
    userId: (state) => state.userId,
    buttons: (state) => state.buttons,
    functionId: (state) => state.functionId,
    dataRule: (state) => state.dataRule,
    newPath: (state) => state.newPath,
    interfaceData: state => state.interfaceData,
    pathRouteMap: state => state.pathRouteMap,
    menuKey: state => state.menuKey,
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo || {};
    },
    setTagList (state, tagList) {
      state.tagList = tagList;
    },
    setMenuList (state, menuList) {
      state.menuList = menuList || [];
    },
    setMenu (state, menu) {
          if (!menu) {
              state.menu = [];
              return;
          }
          
          // 递归为每个路由添加 name
          const addName = (routes) => {
          routes.forEach(route => {
              // 添加 name 属性
              if (route.path) {
                  route.name = route.path.replace(/^\//, '');
              }
              
              // 递归处理子路由
              if (route.children && Array.isArray(route.children)) {
                  addName(route.children);
              }
          });
          return routes;
    };
    
    state.menu = addName(menu);
    console.log(state.menu,'menu')
    },
    setLoginStatus (state, loginStatus) {
      state.loginStatus = loginStatus || "1";
    },
    setUserId (state, id) {
      state.userId = id;
    },
    async setButtons (state, list) {
      if (Array.isArray(list) && list.length > 0) {
        state.buttons = list.map((item) => item.perms);
        await this._vm.$ax.$store.dispatch(
          "permissions/setPermissionsList",
          state.buttons
        );
      } else {
        state.buttons = [];
        await this._vm.$ax.$store.dispatch(
          "permissions/setPermissionsList",
          []
        );
      }
    },
    async setDataRule (state, dataRule) {
      state.dataRule = dataRule || {};
    },
    async setTabList (state, list) {
      state.tabList = list;
    },
    setFunctionId (state, id) {
      state.functionId = id;
    },
    setNewPath (state, data) {
      state.newPath = data;
    },
    setInterface (state, obj) {
      state.interfaceData = obj
    },
    setPathRouteMap (state, data) {
      state.pathRouteMap = data
    },
    setMenuKey (state, data) {
      state.menuKey = data
    },
  },
  actions: {
    async getMenuList ({ commit, dispatch }, prefix) {
      try {
        // 获取菜单
        // const menu = (await get('/system-common/permission/getMenu'))?.data?.menu
        const menu = (await get("/system-common/userAppFunction/tree"))?.data?.menu;
        commit("setMenu", JSON.parse(JSON.stringify(menu)));
        const menuList = getAsyncRoutes2([...menu], prefix);
        router.addRoutes(menuList);
        router.addRoutes(getAsyncRoutes1(routes, prefix));

        await dispatch("getMenuItemBtn");

        await dispatch('getPathRouteMap')

        commit("setMenuList", menuList);
        commit("setMenuKey", new Date().getTime());
        return menuList;
      } catch (e) {
        if (e.status === 403) {
          cookieUtil.removeToken();
          cookieUtil.removeFromCookie("dataRule");
          router.push({
            path: "@/pages/login",
          });
        }
      }
    },
    async getUserInfo ({ commit }) {
      try {
        // 获取菜单
        const { data } = await get("/system-common/user/fusion/getLoginUser");
        commit("setUserInfo", data || {});
      } catch (e) {
        //
      }
    },
    async getMenuItemBtn ({ commit }) {
      try {
        // 获取菜单
        const data = (await get("/system-common/userAppFunction/getMenuItem")).data;

        commit("setDataRule", data.dataRule);
        // if (getters.userInfo.username === 'super') {
        commit("setButtons", data.buttons);
        commit("setTabList", data.tabList);
        // }

      } catch (e) {
        //
      }
    },
    async getNewPath ({ commit }, appFunctionId) {
      try {
        // 获取菜单
        const data = (
          await get("/system-common/userAppFunction/getNewPath", { appFunctionId })
        ).data;
        commit("setNewPath", data);
      } catch (e) {
        //
      }
    },
    //
    async getMenuButtonTab ({ commit, getters }, functionId) {
      try {
        if (getters.userInfo.username !== 'super') {
          const data = (
            await get("/system-common/userAppFunction/getMenuButtonTab", { functionId })
          ).data;

          commit("setButtons", data.buttons);
          commit("setTabList", data.tabList);
        }
      } catch (e) {
        //
      }
    },
    // 获取系统参数
    async getInterface ({ commit }) {
      try {
        // const { data } = await api.getInterface(value)
        document.title = '卓元'

        commit("setInterface", {});
      } catch (e) {
        //
      }
    },

    // 获取菜单路径
    async getPathRouteMap ({ commit }) {
      const data = (await get('/system-common/userAppFunction/pathRouteMap')).data
      commit('setPathRouteMap', data)
    }
  },
};

export default app;
