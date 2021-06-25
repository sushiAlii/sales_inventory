<template>
    <v-main>
        <navbar />
        <h1>Inventory</h1>
    </v-main>
</template>

<script>
    import Navbar from '@/components/Navbar'

    export default {
        name: 'Inventory',

        components: {
            Navbar,
        },
    }
</script>
