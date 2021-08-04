<template>
    <v-main>
        <navbar />
        <h1>Manage Accounts</h1>
        <v-row
            align="center"
            justify="space-around"
        >
            <v-btn
                depressed
                color="primary"
                class="mt-2"
                @click.prevent="handleRegister"
                elevation="1"
            >
                Create Account
            </v-btn>
        </v-row>
    </v-main>
</template>

<script>
    import Navbar from '@/components/Navbar'
    import { supabase } from '@/supabase'


    export default {
        name: 'Manage-Accounts',

        components: {
            Navbar,
        },
        data () {
            return {

            }
        },
        methods: {
            async handleRegister () {
                try{
                    const { user, session, error } =  await supabase.auth.signUp({
                    email: 'aliasgar.laut@gmail.com',
                    password: 'password',
                    }).then(response => {
                        console.log(response);
                    })
                }catch(error){
                    console.log(error);
                }
            }
        }
        
    }
</script>
