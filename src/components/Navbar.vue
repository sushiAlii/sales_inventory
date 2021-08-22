<template>
    <nav>
        <v-app-bar
        id="app-bar"
        absolute 
        app
        color="grey lighten-3"
        flat
        height="75"
        >
            <v-app-bar-nav-icon @click="drawer = !drawer" class="white ml-1" elevation="2"></v-app-bar-nav-icon>
                <v-app-bar-title class="hidden-sm-and-down font-weight-light" v-text="$route.name">  
                </v-app-bar-title>
            <v-spacer></v-spacer>
        </v-app-bar>

        <!--        NAVIGATION DRAWER -->
        <v-navigation-drawer class="nav-drawer" v-model="drawer" app dark>
            <v-row
            
                align="center"
                justify="center"
            >
                <v-col
                    class="mt-5"
                    align="center"
                    cols="12"
                    md="12"
                >
                    <v-avatar size="100">
                    <v-img
                        :src="profile.avatar_url"
                        alt=""
                    ></v-img>
                    </v-avatar>
                </v-col>        
            </v-row>
            <v-row>
                    <v-col
                        align="center"
                        class="mb-n5 mt-n4"
                        cols="12"
                        md="12"
                    >
                        <p class="white--text subheading">
                            {{ profile.first_name + " " + profile.last_name}}
                        </p>
                    
                    </v-col>
            </v-row>
            <v-row>
                <v-col
                        align="center"
                        class="mt-n4"
                        cols="12"
                        md="12"
                    >
                        <p class="white--text subheading">
                            {{ profile.roles.role_name}}
                        </p>
                    
                    </v-col>
            </v-row>
               
            <v-divider class="white mx-4"></v-divider>
            <v-list dense nav>
                <v-list-item v-for="item in items" :key="item.text" router :to="item.route" class="tile">
                    <v-list-item-icon>
                        <v-icon> {{ item.icon }} </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="subtitle-2">{{ item.text }}</v-list-item-content>
                </v-list-item>
                <v-list-group
                class="tile"
                :value="false"
                prepend-icon="mdi-hammer-screwdriver"
                >
                    <template v-slot:activator>
                        <v-list-item-title class="subtitle-2">Settings</v-list-item-title>
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
                
                <v-list-item class="tile" @click="handleLogout">
                    <v-list-item-icon>
                        <v-icon color="red">mdi-power-plug-off</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="subtitle-2 red--text darken-2" > Logout </v-list-item-content>
                </v-list-item>
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
    import { mapGetters } from 'vuex'

    export default{
        data(){
            return {
                drawer : true,
                collapseOnScroll: true,
                items: [
                    {icon: 'mdi-view-dashboard', text: 'Dashboard', route: '/'},
                    {icon: 'mdi-coffee', text: 'Items', route: '/items'},
                    {icon: 'mdi-cube', text: 'Inventory', route: '/inventory'},
                    {icon: 'mdi-store', text: 'Operations', route: '/operations'},
                ],
                settings: [
                    {icon: 'mdi-account-settings', text: 'Account', route: '/settings/accounts'},
                    {icon: 'mdi-account-cog', text: 'Manage Accounts', route: '/settings/manage_accounts'},
                ],
                active: true,
            }
        },
        computed:{
            ...mapGetters({
                user: 'getUser',
                profile: 'getProfile'
            })
        },
        mounted(){
            console.log("USER " + this.user)
        },
        methods: {
            async handleLogout () {
                // const {error} = await supabase.auth.signOut()
                // .then(response => {
                //     console.log(response)
                //     this.$router.push('/login')
                // })
                this.$store.dispatch("signOutAction")
            },
        }
    }
</script>

<style>
    .nav-drawer{
        width: 100%;
        height: 100%;
        /* background-image: url("https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"); */
        background-image: url("https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
        /* background-image: url("https://images.pexels.com/photos/2106768/pexels-photo-2106768.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940") */
    }
</style>


// https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500