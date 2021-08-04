<template>
    <v-main>
        <navbar />
        <h1>Accounts</h1>
    </v-main>
</template>

<script>
    import Navbar from '@/components/Navbar'
    import { supabase } from '@/supabase'
    

    export default {
        name: 'Accounts',

        components: {
            Navbar,
        },
        mounted(){
            this.loadUser();
        },
        methods: {
            loadUser(){
                const user = supabase.auth.user()
                console.log(user);
            }
        }
    }
</script>
