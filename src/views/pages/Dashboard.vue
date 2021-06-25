<template>
    <v-main>
        <navbar />
        <h1>Home</h1>
    </v-main>
</template>

<script>
    import Navbar from '@/components/Navbar'

    export default {
        name: 'Home',

        components: {
            Navbar,
        },
    }
</script>
