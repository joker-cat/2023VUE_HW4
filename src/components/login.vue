<template>
    <div class="container">
        <div class="row justify-content-center">
            <h1 class="h3 mb-3 font-weight-normal text-center">
                請先登入
            </h1>
            <div class="col-8">
                <form id="form" class="form-signin">
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="username" placeholder="name@example.com" required
                            autofocus v-model="userInfo.username">
                        <label for="username">Email address</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="password" placeholder="Password" required
                            v-model="userInfo.password">
                        <label for="password">Password</label>
                    </div>
                    <button class="btn btn-lg btn-primary w-100 mt-3" type="submit" @click.prevent="login">
                        登入
                    </button>
                    <button class="btn btn-lg btn-primary w-100 mt-3" type="button" @click="checkLogin">
                        驗證登入
                    </button>
                    <p class="text-center" :style="{ color: hasCookie ? 'green' : 'red' }" style="padding: 5px;">{{
                        hasCookie ? '已驗證' : '未持有驗證' }}</p>
                </form>
            </div>
        </div>
        <p class="mt-5 mb-3 text-muted text-center">
            &copy; 2021~∞ - 六角學院
        </p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            hasCookie: false, //是否有cookie
            userInfo: { //帳號密碼
                username: '',
                password: '',
            },
            userLogin: false, //是否登入
        }
    },
    created() {
        this.hasCookie = document.cookie.includes('mycookieTest')
    },
    methods: {
        login() {
            this.$http
                .post('https://ec-course-api.hexschool.io/v2/admin/signin', this.userInfo)
                .then((res) => {
                    let { token, expired } = res.data;
                    this.hasCookie = true;
                    document.cookie = `mycookieTest=${token};expires=${new Date(expired)};`;
                    token = document.cookie.replace(
                        /(?:(?:^|.*;\s*)mycookieTest\s*\=\s*([^;]*).*$)|^.*$/,
                        "$1",
                    );
                    this.$http.defaults.headers.common['Authorization'] = token; //意思是下次發axios請求時，會把token以headers一起發送。
                    this.$router.push({ path: '/admin' });
                }).catch((error) => {
                    console.log(error);
                })
        },
        checkLogin() {
            (this.hasCookie === false) ? alert('未驗證') : alert('已驗證');
        }
    }
}
</script>

<style scoped>
body {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
}
</style>