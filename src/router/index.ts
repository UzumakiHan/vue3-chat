import {createRouter, createWebHistory} from 'vue-router';
import storage from '@/common/storage';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/home.vue'),
        meta: {
            showTabBar: true,
            keepAlive: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login.vue'),
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/my',
        name: 'My',
        component: () => import('@/views/my.vue'),
        meta: {
            showTabBar: true,
            keepAlive: true
        }
    },
    {
        path: '/wechatmoments',
        name: 'WechatMoment',
        component: () => import('@/views/wechat-moment.vue'),
        meta: {
            showTabBar: true,
            keepAlive: true
        }
    },
    {
        path: '/publicmoments',
        name: 'PublicMoments',
        component: () => import('@/views/plubish-moment.vue'),

        meta: {
            showTabBar: false,
            keepAlive: true
        }
    },
    {
        path: '/maillist',
        name: 'MailList',
        component: () => import('@/views/mail-list.vue'),
        meta: {
            showTabBar: true,
            keepAlive: false
        }
    },
    {
        path: '/grounpchatpage/:chatRoomId',
        name: 'GrounpChatPage',
        component: () => import('@/views/chat-grounp-page.vue'),
        meta: {
            showTabBar: false,
            keepAlive: true
        }
    },
    {
        path: '/chatpage/:targetId/:sendId',
        name: 'ChatPage',
        component: () => import('@/views/chat-page.vue'),
        meta: {
            showTabBar: false,
            keepAlive: true
        }
    },
    {
        path: '/searchfriends/:searchKey',
        name: 'SearchFriends',
        component: () => import('@/views/search-friends.vue'),
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/applyfriends',
        name: 'ApplyFriends',
        component: () => import('@/views/apply-friends.vue'),
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/chatuserInfo/:id',
        name: 'ChatUserInfo',
        component: () => import('@/views/chat-userinfo.vue'),

        meta: {
            showTabBar: false,
            keepAlive: true
        }
    },
    {
        path: '/personalinfo/:id',
        name: 'PersonalInfo',
        component: () => import('@/views/personal-info.vue'),
        meta: {
            showTabBar: false,
            keepAlive: true
        }
    },
    {
        path: '/changepassword',
        name: 'ChangePassword',
        component: () => import('@/views/change-pwd.vue'),

        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/changemomentbg',
        name: 'ChangeMomentBg',
        component: () => import('@/views/change-moment-bg.vue'),

        meta: {
            showTabBar: false
        }
    },
    {
        path: '/maplocation',
        name: 'MapLocation',
        component: () => import('@/views/map-location.vue'),

        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/mychatgrounp',
        name: 'MyChatGrounp',
        component: () => import('@/views/my-chat-grounp.vue'),

        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/grounpchatinfo/:chatRoomId',
        name: 'Grounpchatinfo',
        component: () => import('@/views/grounp-chat-info.vue'),

        meta: {
            showTabBar: false,
            keepAlive: true
        }
    },
    {
        path: '/selectchatfriends',
        name: 'SelectChatFriends',
        component: () => import('@/views/select-friends.vue'),

        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/mywechatmoments',
        name: 'MyWechatMoments',
        component: () => import('@/views/my-wechat-moment.vue'),
        meta: {
            showTabBar: false,
            keepAlive: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/not-found.vue')
    }
];
const router = createRouter({
    history: createWebHistory('/'),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {top: 0};
        }
    },
    routes
});
// vue路由导航守卫控制访问权限
// 如果用户没有登录，但是直接通过URL访问特定页面，需要重新导航到登录页面
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next();
    }
    storage.getItem('vue3-chat-token').then(val => {
        if (!val) {
            next('/login');
        } else {
            next();
        }
    });
});
export default router;
