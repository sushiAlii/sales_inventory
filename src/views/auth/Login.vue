<template>
        <v-main class="login-page">
            <v-container
                fill-height
                fluid
            >
                <v-row
                    justify="center"
                    align="center"
                >
                    <v-card 
                        class="elevation-10"
                        max-width="400px"
                        
                        dark
                    >
                        <v-row
                            class="mx-10"
                        >
                                <v-col
                                    cols="12"
                                    md="12"
                                >
                                    <v-card-title class="mt-5 ml-n7">
                                        Welcome back!
                                    </v-card-title>
                                </v-col>
                                
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
                                            <v-col
                                                cols="12"
                                                md="12"
                                            >
                                                <div class="text-end">
                                                    <v-btn class="mb-10" color="white" light type="submit">SIGN IN</v-btn>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                
                        </v-row>
                    </v-card>
                </v-row>
            </v-container>
    </v-main>
</template>

<script>
    import { supabase } from '@/supabase'
    import { Store } from "vuex";


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
                this.$store.dispatch("signInAction", this.formData)

            },
        }
        
    }
</script>

<style>
    .login-page{
        width: 100%;
        height: 100%;
        background-image: url("https://images.pexels.com/photos/4195409/pexels-photo-4195409.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260");
        background-size: 100% 100%;
        
    }
</style>