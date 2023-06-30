import {createApp} from 'vue';
import 'vant/lib/index.css';
import '@/scss/app.scss';
import {createPinia} from 'pinia';
import vant from '@/common/vant';
import App from './App.vue';
import router from '@/router';
import * as Sentry from '@sentry/vue';

const app = createApp(App);
app.use(createPinia());
vant.forEach(item => {
    app.use(item);
});
console.log(import.meta.env);
if (import.meta.env.MODE === 'production') {
    Sentry.init({
        app,
        dsn: 'https://997dff4239b94eaf9af66511a89526f5@o4505344036110336.ingest.sentry.io/4505446314147840',
        integrations: [
            new Sentry.BrowserTracing({
                // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
                tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
                routingInstrumentation: Sentry.vueRouterInstrumentation(router)
            }),
            new Sentry.Replay()
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
}
app.use(router);
app.mount('#app');
