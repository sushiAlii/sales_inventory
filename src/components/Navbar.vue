<template>
    <nav>
        <v-app-bar
        app 
        flat 
        color="grey lighten-3"
        :collapse="!collapseOnScroll"
        :collapse-on-scroll="collapseOnScroll"
        >
            <v-app-bar-nav-icon @click="drawer = !drawer" class="white ml-1" elevation="2"></v-app-bar-nav-icon>
            <v-app-bar-title class="text-uppercase black--text">
                <span class="font-weight-light">black</span>
                <span>scoop</span>
            </v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn elevation=0 color="transparent" @click.prevent="handleLogout">
                <span>Sign Out</span>
                <v-icon right>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>

        <!--        NAVIGATION DRAWER -->
        <v-navigation-drawer class="black" v-model="drawer" app dark>
            <v-layout column align-center>
                <v-flex class="mt-5">
                    <v-avatar size="100">
                        <img src="/logo.jpg" alt="">
                    </v-avatar>
                </v-flex>
            </v-layout>
            <v-list dense nav>
                <v-list-item v-for="item in items" :key="item.text" router :to="item.route" class="tile">
                    <v-list-item-icon>
                        <v-icon> {{ item.icon }} </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="subtitle-1">{{ item.text }}</v-list-item-content>
                </v-list-item>
                <v-list-group
                class="tile"
                :value="false"
                prepend-icon="mdi-hammer-screwdriver"
                >
                    <template v-slot:activator>
                        <v-list-item-title class="subtitle-1">Settings</v-list-item-title>
                    </template>
                    <v-list-item 
                    v-for="setting in settings" 
                    :key="setting.text" 
                    router 
                    :to="setting.route"
                    >
                        <v-list-item-title v-text="setting.text" class="subtitle-2 ml-14"></v-list-item-title>
                        <v-list-item-icon>
                            <v-icon v-text="setting.icon"></v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>
<style scoped>
  .tile {
    margin: 10px;
    border-radius: 6px;
  }
</style>

<script>
    import { supabase } from '@/supabase'

    export default{
        data(){
            return {
                drawer : true,
                collapseOnScroll: true,
                items: [
                    {icon: 'mdi-view-dashboard', text: 'Dashboard', route: '/'},
                    {icon: 'mdi-coffee', text: 'Items', route: '/items'},
                    {icon: 'mdi-cube', text: 'Inventory', route: '/inventory'},
                ],
                settings: [
                    {icon: 'mdi-account-settings', text: 'Account', route: '/settings/accounts'},
                    {icon: 'mdi-account-cog', text: 'Manage Accounts', route: '/settings/manage_accounts'},
                    {icon: 'mdi-cogs', text: 'Miscellaneous', route: '/settings/miscellaneous'},
                ],
                active: true,
            }
        },
        methods: {
            async handleLogout () {
                const {error} = await supabase.auth.signOut()
                .then(response => {
                    console.log(response)
                    this.$router.push('/login')
                })
            }
        }
    }
</script>


