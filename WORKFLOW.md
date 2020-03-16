# Сервис по поиску мест и заведений для провождения досуга. Процесс разработки
Вся документация по API запросам и моделям доступна по адресу **http://localhost:3000/api-docs**

## Авторизация
Для удобства пользователей предлагаю ввести несколько способов авторизации: обычная (почта + пароль) и авторизация 
через социальные сети. Из сетей предлагаю взять наиболее популярны и простые в разработке: Google и Facebook. Они дают 
возможность по API получить имя юзера и его почту для возможности отсылать электронные письма. 
\
Так как на фронт-енде будет SPA, добавить поддержку обычных сессий не получится. Поэтому идентификация пользователя будет производиться посредством специального токена, который будет передан на front-end при успешной авторизации. На фронте нужно будет его сохранить куда-то для возможности дальнейшего использования, например, в localStorage и передавать его в хедерах при каждом запросе к апи. При использовании axios это удобно сделать при помощи interceptors:
```js
const instance = axios.create({
    baseURL: 'http://localhost:3000',
});

instance.interceptors.request.use(config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});
```
На сервере этот ключ будет проверяться на валидность и если с ним все ок, фронт получит запрашиваемые данные. Если токен невалиден или его срок действия истек, в ответе придет HTTP статус 403. В таком случае нужно удалить старый токен из localStorage и отправить пользователя на страницу входа на сайт для повторной авторизации.
При использовании axios это также удобно сделать при помощи interceptors:
```js
instance.interceptors.response.use(
    response => response,
    error => {
        if (403 === error.response.status) {
            localStorage.removeItem('token');
            router.replace({ name: 'login' });
        } else {
            return Promise.reject(error);
        }
    },
);
```
Ну и в конце нужно повесить guard на роутер:
```js
router.beforeEach((to, from, next) => {
    const isAuthorized = authService.isAuthorized();

    if (['login', 'register'].includes(to.name) && isAuthorized) {
        return next({ name: 'home' });
    }

    if (to.meta.requiresAuth) {
        if (isAuthorized) {
            next();
        } else {
            next({ name: 'login' });
        }
    } else {
        next();
    }
});
```

### Локальная авторизация (электронная почта + пароль)
Здесь нет ничего сложного: отправляем на сервер почту + пароль. Пароль будет зашифрован перед сохранением в БД. На почту будет отправлено письмо для подтверждения адреса. Пока почта не подтверждена, аккаунт считается неактивным.
 
### Google
Для получения возможности входа через Google необходимо создать [проект](https://developers.google.com/identity/sign-in/web/sign-in) и получить API ключ.
\
На сайт нужно подключить Google Auth SDK:
```html
<script src="https://apis.google.com/js/platform.js" async defer></script>
```
После инициализации SDK можно повесить обработчик на клик на кнопку входа через Google:
```js
window.gapi.load('auth2', () => {
    const instance = window.gapi.auth2.init({
        client_id: process.env.GOOGLE_CLIENT_ID,
    });

    instance.attachClickHandler(
        // Элемент, на который вешаем клик
        document.querySelector('.js-login-with-google'),

        // Объект опций (https://cutt.ly/qtfoSOy)
        {},

        // Callback, который выполнится после успешной авторизации пользователя. Объект 
        // googleUser содержит всю запрашиваемую инфу о юзере
        googleUser => {},
    
        // Callback, который выполнится после неудачной авторизации пользователя
        error => {},
    );
});
```
В обработчике успешного входа нужно получить id_token пользователя и отправить его на сервер:
```js
async googleUser => {
    try {
        const idToken = googleUser.getAuthResponse().id_token;
        
        const response = await axios.post('/login/google', { idToken });
        const { tokenData, userData } = response.data;

        // Сохраняем токен и публичные данные о пользователе в localStorage, например
        // ...

        this.$router.replace({ name: 'home' });
    } catch (error) {
        this.authError = error.message;
    }
}
```
См. [доку](https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin) чтобы получить больше инфы

### Facebook
Для получения возможности входа через Facebook необходимо создать [проект](https://developers.facebook.com/docs/apps/) и получить API ключ.
\
На сайт нужно подключить Facebook Auth SDK:
```html
<script src="https://connect.facebook.net/en_US/sdk.js" async defer></script>
```
После загрузки скрипта нужно инициализировать модуль авторизации:
```js
window.FB.init({
    appId: process.env.FACEBOOK_CLIENT_ID,
    cookie: true,
    xfbml: true,
    version: 'v6.0',
});
```
Далее можем навесить обработчик на кнопку входа через Facebook. В нем нужно получить токен пользователя и его ID и отправить эти данные на сервер:
```js
window.FB.login(async response => {
    const accessToken = response.authResponse.accessToken;
    const userId = response.authResponse.userID;

    const res = await axios.post('/login/facebook', { accessToken, userId });
    const { tokenData, userData } = res.data;

    // Сохраняем токен и публичные данные о пользователе в localStorage, например
    // ...

    this.$router.replace({ name: 'home' });
});
```
См. [доку](https://developers.facebook.com/docs/javascript) чтобы получить больше инфы

### Нюансы
Хранить токен в localStorage - небезопасно, поэтому есть несколько вариантов прохождения процесса авторизации:
1. Забить на это и использовать jsonwebtoken как описано выше
1. Заменить SPA на SSR. Это позволит ввести нормальные безопасные сессии через http-only cookies
1. Заставить пользователя авторизироваться при каждом входе на сайт. После получения токена его можно сохранить в 
переменной внутри приложения, к которой не будет доступа у внешних скриптов.

