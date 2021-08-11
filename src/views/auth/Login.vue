<template>
        <v-main class="login-page">
            <v-container
                fill-height
                fluid
            >
                <v-row
                    align="center"
                    justify="center"
                >
                    <v-card 
                        class="elevation-10"
                        max-width="500px"
                        dark
                    >
                        <v-row
                            class="mx-10"
                        >
                                <v-col
                                    class="ml-n4"
                                    cols="12"

                                >
                                    <v-card-title
                                    
                                    >
                                        Welcome back!
                                    </v-card-title>
                                </v-col>
                                <v-col
                                    cols="12"
                                >
                                    <v-form class="" @submit.prevent="handleLogin">
                                        <v-row>
                                            <v-col
                                                cols="12"
                                                md="12"
                                            >
                                                <v-text-field
                                                label="Email"
                                                name="email"
                                                append-icon="mdi-email"
                                                dense
                                                outlined
                                                filled
                                                type="text"
                                                color="white"
                                                v-model="formData.email"
                                                />
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                md="12"
                                            >
                                                <v-text-field
                                                label="Password"
                                                name="password"
                                                append-icon="mdi-lock"
                                                dense
                                                outlined
                                                filled
                                                type="password"
                                                color="white"
                                                v-model="formData.password"
                                                />
                                            </v-col>
                                        </v-row>
                                        <div class="text-center mt-3">
                                            <v-btn class="my-10" color="white" light type="submit">SIGN IN</v-btn>
                                        </div>  
                                    </v-form>
                                </v-col>
                        </v-row>
                    </v-card>
                </v-row>
            </v-container>
    </v-main>
</template>

<script>
    import { supabase } from '@/supabase'


    export default {
        name: 'Login',

        data () {
            return {
                alignments: [
                    'start',
                    'center',
                    'end',
                ],
                formData: {
                    email: '',
                    password: '',
                },

            }
        },
        methods: {
            async handleLogin () {
                console.log("hi");
                const { user, error } = await supabase.auth.signIn({
                    email: this.formData.email,
                    password: this.formData.password
                }).then(response => {
                    console.log(response);
                    this.$router.push('/')
                })
            },
        }
        
    }
</script>

<style>
    .login-page{
        width: 100%;
        height: 100%;
        max-height: 100%;
        margin: 0;
        padding: 0;
        background-image: url("https://images.pexels.com/photos/4195409/pexels-photo-4195409.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
</style>