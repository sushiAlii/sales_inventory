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
                                
                                    <v-form 
                                        ref="loginForm"
                                        @submit.prevent="handleLogin"
                                    >
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
                                                    :rules="[rules.required, rules.email]"
                                                    :error-messages="login ? 'Incorrect email or password' : ''"
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
                                                :rules="[rules.required, rules.counter]"
                                                :error-messages="login ? 'Incorrect email or password' : null"
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

    import { mapGetters } from 'vuex'



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
                rules: {
                    required: value => !!value || 'Required.',
                    counter: value => value.length <= 20 || 'Max 20 characters',
                    email: value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Invalid e-mail.'
                    },
                },
            }
        },
        computed:{
            ...mapGetters({
                login: 'getLogin'
            })
        },
        mounted(){
            console.log(this.login)
        },
        methods: {
            async handleLogin () {
    
                try{
                    if(this.$refs.loginForm.validate()){
                        console.log(this.login)
                        const response = this.$store.dispatch("signInAction", this.formData)
                        console.log(response)
                        console.log(this.login)

                        if(this.login == false){
                            console.log("Login Failed")
                        }else{
                            console.log("Login Success")
                        }
                        // if(this.$store.dispatch("signInAction", this.formData)){
                        //     console.log("Login Success!")
                        // }else{
                        //     console.log("Login Failed!")
                        //     this.loginFailed = true
                        //     this.formData.password = ''
                        // }
                    }else{
                        
                        this.formData.password = ''
                    }
               
                }catch(error){
                    this.$refs.loginForm.validate()
                }

            },
        }
        
    }
</script>

<style>
    .login-page{
        width: 100%;
        height: 100%;
        /* background-image: url("https://images.pexels.com/photos/4195409/pexels-photo-4195409.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"); */
        background-image: url("https://images.pexels.com/photos/389818/pexels-photo-389818.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
        background-size: 100% 100%;
        
    }
</style>