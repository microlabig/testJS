<template lang="pug">
    section
        .container
        h1 Webpack and {{message}}
</template>

<script>
export default {
    data() {
        return {
            message: null
        }
    },
    async created() {
        this.message = await this.$store.getters.getMessage;
    }
}
</script>

<style lang="scss" scoped>
    h1 {
        color: burlywood;
    }
</style>