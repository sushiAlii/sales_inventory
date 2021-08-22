<template>
    <v-app>
        <nav-bar></nav-bar>

        <home-view></home-view>

    </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'
import HomeView from './pages/HomeView'

export default {
    name: 'Index',
    components: {
        'nav-bar': Navbar,
        'home-view': HomeView
    }

}
</script>