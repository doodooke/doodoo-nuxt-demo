<template>
    <section class="container">
        <div>
            <logo />
            <h1 class="title">
                {{title}}
            </h1>
            <div class="links">
                <el-button type="primary">Documentation</el-button>
                <el-button type="danger">GitHub</el-button>
            </div>
        </div>
    </section>
</template>

<script>
import Logo from "./../component/logo.vue";
export default {
    components: {
        Logo,
        title: ""
    },
    async asyncData({ app }) {
        const data = {};
        const res = await app.$axios.$get("/api/hello/test/index");
        if (res && res.data) {
            data.title = res.data;
        }
        return data;
    }
};
</script>

<style>
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.title {
    font-family: "Quicksand", "Source Sans Pro", -apple-system,
        BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
        sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
}
.subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
}
.links {
    padding-top: 15px;
}
</style>