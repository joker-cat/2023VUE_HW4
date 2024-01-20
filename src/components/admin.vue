<template>
    <div class="container">
        <div class="row py-3">
            <div class="col-lg-7 col-sm-12">
                <h2>產品列表</h2>
                <table class="table table-hover mt-4">
                    <thead>
                        <tr>
                            <th width="180">產品名稱</th>
                            <th width="50">
                                原價
                            </th>
                            <th width="50">
                                售價
                            </th>
                            <th width="70">
                                是否啟用
                            </th>
                            <th width="130">
                                查看細節
                            </th>
                            <th width="140">
                                管理
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in products" :key="item.id">
                            <td width="180">{{ item.title }}</td>
                            <td width="50">
                                {{ item.origin_price }}
                            </td>
                            <td width="50">
                                {{ item.price }}
                            </td>
                            <td width="70">
                                <span class="text-success" v-if="item.is_enabled === 1">啟用</span>
                                <span v-else>未啟用</span>
                            </td>
                            <td width="130">
                                <button type="button" class="btn btn-primary" @click="detail(item)">查看細節</button>
                            </td>
                            <td width="140">
                                <button type="button" class="btn btn-outline-primary btn-sm me-2" data-bs-toggle="modal"
                                    data-bs-target="#putProductModal" @click="editChoose(item)">
                                    編輯
                                </button>
                                <button type="button" class="btn btn-outline-danger btn-sm" @click="delProduct(item.id)">
                                    刪除
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between px-4">
                    <span class="align-self-center">目前有 {{ products.length }} 項產品</span>
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#productModal">建立新的產品</button>
                </div>
            </div>
            <!-- <div class="col-lg-5 col-sm-12">
                <h2>單一產品細節</h2>
                <template v-if="chooseIsNull">
                    <div class="card mb-3">
                        <img :src="userChoose.imageUrl" class="card-img-top primary-image" alt="主圖">
                        <div class="card-body">
                            <h5 class="card-title">
                                {{ userChoose.title }}
                                <span class="badge bg-primary ms-2">{{ userChoose.category }}</span>
                            </h5>
                            <p class="card-text">商品描述：{{ userChoose.description }}</p>
                            <p class="card-text">商品內容：{{ userChoose.content }}</p>
                            <div class="d-flex">
                                <p class="card-text me-2">{{ userChoose.price }}</p>
                                <p class="card-text text-secondary"><del>{{ userChoose.origin_price }}</del></p>
                                元 / {{ userChoose.unit }}
                            </div>
                        </div>
                    </div>
                    <template v-for="(img, idx) in userChoose.imagesUrl" :key="img">
                        <img :src="img" alt="圖片error" class="images m-2">
                    </template>
                </template>
                <p class="text-secondary" v-if="!chooseIsNull">請選擇一個商品查看</p>
            </div> -->
            <productInfo :userChoose="userChoose"/>
            <addProduct @reloadRender="render" />
            <editProduct :choose="putChoose" @reloadRender="render" />
        </div>
    </div>
</template>

<script>
import addProduct from './addProduct.vue';
import editProduct from './editProduct.vue';
import productInfo from './productInfo.vue';
export default {
    data() {
        return {
            pathname: '', //當前路徑
            hasCookie: false, //是否有cookie
            userChoose: {}, //品項選擇
            putChoose: {}, //品項編輯
            products: [], //全部品項,
            addProduct: { //新增
                data: {
                    "title": "",
                    "category": "",
                    "origin_price": "",
                    "price": "",
                    "unit": "個",
                    "description": "",
                    "content": "",
                    "is_enabled": 0,
                    "imageUrl": "",
                    "imagesUrl": []
                }
            }
        }
    },
    created() {
        this.pathname = this.$route.path;
        this.hasCookie = document.cookie.includes('mycookieTest');
        if (this.pathname === '/admin' && this.hasCookie === false) {
            this.$router.push({ path: '/' });
        }
        if (this.hasCookie === true) {
            this.$http.defaults.headers.common['Authorization'] =
                document.cookie.replace(/(?:(?:^|.*;\s*)mycookieTest\s*\=\s*([^;]*).*$)|^.*$/, "$1",); //意思是下次發axios請求時，會把token以headers一起發送。
            this.render();
        }
    },
    methods: {
        delProduct(id) {
            this.$http
                .delete(`https://ec-course-api.hexschool.io/v2/api/joooker/admin/product/${id}`)
                .then((res) => {
                    if (res.data.success) {
                        this.hasCookie = res.data.success;
                        this.render();
                        alert('已刪除');
                    }
                }).catch((error) => {
                    console.log(error);
                })
        },
        editChoose(item) {
            this.putChoose = { ...item };
        },
        detail(item) {
            this.userChoose = { ...item };
        },
        render() {
            this.$http
                .get('https://ec-course-api.hexschool.io/v2/api/joooker/admin/products')
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((error) => {
                    console.log(error);
                })
        },
    },
    components: {
        addProduct,
        editProduct,
        productInfo
    },
}
</script>

<style scoped>
</style>