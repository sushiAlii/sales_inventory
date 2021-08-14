<template>
    <v-main>
        <navbar />
        
        <v-container class="my-15">
            <v-row>
                <v-col
                    cols="12"
                    md="4"
                    sm="12"
                    v-for="profile in profiles"
                    :key="profile.id"
                >
                    <base-material-card
                    class="v-card-profile"
                    v-bind:avatar= "profile.avatar_url"
                    >
                    <v-card-text class="text-center" style="overflow-y: auto; height:250px">
                        <h6 class="display-1 mb-1 grey--text">
                            {{ profile.role_name }}
                        </h6>

                        <h4 class="display-2 font-weight-light mb-3 black--text">
                        {{ profile.first_name }} {{ profile.last_name }}
                        </h4>

                        <p class="font-weight-light grey--text">
                            {{ profile.about_me }}
                        </p>
                    </v-card-text>
                        <v-card-actions
                            class="mb-n4"
                            v-if="user_profile.roles.role_name != 'Staff'"
                        >
                            <v-btn
                                color="red darken-2"
                                text
                                @click="reserve"
                            >
                                Delete
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="deep-purple lighten-2"
                                text
                                @click="selectItem"
                            >
                                Edit
                            </v-btn>
                        </v-card-actions>
                    </base-material-card>
                </v-col>
            </v-row>
        </v-container>
        <v-container
            v-if="user_profile.roles.role_name != 'Staff'"
        >
            <v-dialog
                v-model="dialog"
                persistent
                max-width="600px"
            >
                <template v-slot:activator="{ on, attrs }">
                
                    <div class= "d-flex justify-start">
                        <v-btn
                            depressed
                            color="success"
                            class="d-flex mb-6 mt-2 "
                            elevation="1"
                            v-bind="attrs"
                            v-on="on"
                        >
                            Create Account
                        </v-btn>
                    </div>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="text-h5">Create a User</span>
                    </v-card-title>
                    <v-card-text>
                    <v-container>
                        <v-form
                        ref="form"
                        v-model="userCreate.valid"
                        lazy-validation
                        >
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                    label="Email"
                                    :rules="userCreate.rules.emailRules"
                                    v-model="userCreate.email"
                                    required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                    label="Password"
                                    v-model="userCreate.password"
                                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="show ? 'text' : 'password'"
                                    :rules="userCreate.rules.passwordRules"
                                    @click:append="show = !show"
                                    required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="reset"
                    >
                        Close
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="handleRegister"
                    >
                        Register
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </v-main>
</template>

<script>
    import Navbar from '@/components/Navbar'
    import MaterialCard from '@/components/MaterialCard.vue'
    import { mapGetters } from 'vuex'
    import { supabase } from '@/supabase'


    export default {
        name: 'Manage-Accounts',

        components: {
            Navbar,
            'base-material-card': MaterialCard
        },
        data () {
            return {
                dialog: false,
                show: false,
                userCreate: {
                    valid: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    rules: {
                        emailRules: [
                            v => !!v || 'E-mail is required',
                            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                        ],
                        passwordRules: [
                            v => !!v || 'Password is required',
                            v => v.length >= 8 || 'Min 8 characters',
                        ]
                    }
                },
                profiles: [],
            }
        },
        mounted(){
            this.loadUsers()
        },
        computed:{
            ...mapGetters({
                user: 'getUser',
                user_profile: 'getProfile'
            })
        },
        methods: {
            async handleRegister () {
                try{
                    const { user, session, error } =  await supabase.auth.signUp({
                    email: this.userCreate.email,
                    password: this.userCreate.password,
                    })
                    if(error){
                        console.log('Register failed!')
                    }else{
                        console.log('Register Success! Email Sent')
                    }
                }catch(error){
                    console.log(error);
                }
                this.$refs.form.reset()
                this.dialog = false
            },
            async loadUsers(){
                try{
                    
                    let { data: profiles, error } = await supabase
                        .from('profiles_view')
                        .select('*')


                    if(error){
                        console.log('Failed to load Users')
                    }else{
                        console.log('Users Retrieved Successfully!')
                        this.profiles = profiles
                    }
                }catch(error){
                    console.log(error)
                }
            },
            selectItem(){
                console.log(profile.id)
            },
            reset () {
                console.log('reset')
                this.$refs.form.reset()
                this.dialog = false
            },
        }
        
    }
</script>
