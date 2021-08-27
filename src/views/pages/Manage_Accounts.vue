<template>
    <v-container
        fluid
    >
    <v-row
        class="my-10"
    >
        <v-col
            cols="12"
            md="3"
            sm="12"
            v-for="profile in profiles"
            :key="profile.id"
        >
            <base-material-card
                class="v-card-profile"
                v-bind:avatar= "profile.avatar_url"
            >
            <v-card-text class="text-center" style="overflow-y: auto; height:225px">
                <h6 class="headline mb-1 grey--text">
                    {{ profile.role_name }}
                </h6>

                <h4 class="headline font-weight-light mb-3 black--text">
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
                    <v-spacer></v-spacer>
                    <v-btn
                        color="deep-purple lighten-2"
                        text
                        :disabled="profile.id == user.id"
                        @click="editUser(profile)"
                    >
                        Edit
                    </v-btn>
                </v-card-actions>
            </base-material-card>
        </v-col>
    </v-row>

    <v-dialog
        v-model="editDialog"
        max-width="500px"
    >
        <v-card>
            <v-card-title>
                <span headline>Edit User</span>
            </v-card-title>
            <v-container>
                <v-form>
                    <v-row
                        class="mx-5"
                    >
                        <v-col
                            cols="12"
                            md="7"
                        >
                            <v-text-field
                                v-model="userEdit.first_name"
                                label="First Name"
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            md="5"
                        >
                            <v-text-field
                                v-model="userEdit.last_name"
                                label="Last Name"
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            md="4"
                        >
                            <v-select
                                label="Role"
                                v-model="userEdit.role_name"
                                :items="roles"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
            <v-card-actions>
            <v-spacer></v-spacer>
                <v-btn
                    color="red darken-2"
                    text
                    @click="deleteDialog = !deleteDialog"
                >
                    Delete
                </v-btn>
                <v-btn
                    text
                    color="blue"
                    @click.prevent="saveEdit"
                >
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog
        v-model="deleteDialog"
        persistent
        max-width="350"
    >
        <v-card>
            <v-card-title>
                Delete {{ userEdit.first_name }} {{ userEdit.last_name }} ?
            <v-spacer />

            </v-card-title>

            <v-card-text class="pb-6 pt-12 text-center">
            <v-btn
                class="mr-3"
                text
                @click="deleteDialog = !deleteDialog"
            >
                No
            </v-btn>

            <v-btn
                color="red darken-2"
                text
                @click="deleteUser"
            >
                Yes
            </v-btn>
            </v-card-text>
        </v-card>

    </v-dialog>

    <v-dialog
        v-if="user_profile.roles.role_name != 'Staff'"
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
                <span headline>Create a User</span>
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
    <base-material-snackbar
        v-model="snackbars.createUser.fail"
        type="error"
        v-bind="{ 
                [parsedDirection[0]]: true,
                [parsedDirection[1]]: true
            }"
        >
        User Creation<span class="font-weight-bold">&nbsp;FAILED&nbsp;</span>
        Email is already<span class="font-weight-bold">&nbsp;taken&nbsp;</span>, or both the email and the password are not<span class="font-weight-bold">&nbsp;valid.&nbsp;</span>
    </base-material-snackbar>
    <base-material-snackbar
        v-model="snackbars.createUser.success"
        type="success"
        v-bind="{ 
                [parsedDirection[0]]: true,
                [parsedDirection[1]]: true
            }"
        >
        <span class="font-weight-bold">&nbsp;USER CREATED!&nbsp;</span>Email has been sent for verification. 
    </base-material-snackbar>
</v-container>
</template>

<script>
    import Navbar from '@/components/Navbar'
    import MaterialCard from '@/components/MaterialCard.vue'
    import MaterialSnackbar from '@/components/MaterialSnackbar'
    import { mapGetters } from 'vuex'
    import { supabase } from '@/supabase'


    export default {
        name: 'Manage-Accounts',

        components: {
            Navbar,
            'base-material-card': MaterialCard,
            'base-material-snackbar': MaterialSnackbar
        },
        data () {
            return {
                dialog: false,
                editDialog: false,
                deleteDialog: false,
                show: false,
                roles: [],
                userEdit: { 
                    user_id: '',
                    first_name: '',
                    last_name: '',
                    role_id: '',
                    role_name: '',
                },
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
                snackbars: {
                    direction: 'top center',
                    createUser: {
                        success: false,
                        fail: false
                    }
                }
            }
        },
        mounted(){
            this.loadUsers()
            this.loadRoles()
        },
        computed:{
            ...mapGetters({
                user: 'getUser',
                user_profile: 'getProfile'
            }),
          
            parsedDirection () {
                return this.snackbars.direction.split(' ')
            },
        },
        methods: {
            async handleRegister () {
                this.dialog = false
                try{
                    const { user, session, error } =  await supabase.auth.signUp({
                    email: this.userCreate.email,
                    password: this.userCreate.password,
                    })
                    if(error){
                        console.log('Register failed!')
                        this.snackbars.createUser.fail = !this.snackbars.createUser.fail
                    }else{
                        console.log('Register Success! Email Sent')
                        this.snackbars.createUser.success = !this.snackbars.createUser.success
                    }
                }catch(error){
                    console.log(error);
                    this.createUser.fail = !this.createUser.fail
                }
                this.$refs.form.reset()
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
            async loadRoles(){
                try{
                    console.log(this.roles)
                    //      Retrieving Roles          
                    let { data: roles, error } = await supabase
                    .from('roles')
                    .select('role_name')

                    if(error){
                        console.log(error)
                    }else{
                        console.log(roles)

                        for(let i=0;i<roles.length;i++){
                            this.roles[i] = roles[i].role_name
                        }
                        console.log("Hello " + this.roles)
                    }

                }catch(error){
                    console.log(error)
                }
                
                
            },
            editUser(profile){
                console.log(profile)
                //      Toggle Dialog
                this.editDialog = !this.editDialog

                //      Assigning Values for Dialog
                this.userEdit.user_id = profile.id
                this.userEdit.first_name = profile.first_name
                this.userEdit.last_name = profile.last_name
                this.userEdit.role_name = profile.role_name

                console.log(this.userEdit.role_name)
            },
            async saveEdit(){
                // let role_id = null
                try{
                    console.log(this.userEdit.role_name)
                    console.log(this.userEdit.user_id)
                    //      UPDATE TO SERVER
                    let { data, error } = await supabase
                    .rpc('updaterole', {
                        name_role: this.userEdit.role_name, 
                        id_user: this.userEdit.user_id
                    })
                        if(error){
                            console.log(error)
                        }else{
                            this.editDialog = !this.editDialog
                            this.loadUsers()
                            this.loadRoles()
                        }

                    // let { data: roles, error: error1 } = await supabase
                    // .from('roles')
                    // .select('*')
                    
                    //     for(let i=0;i<roles.length;i++){
                    //         if(roles[i].role_name == this.userEdit.role_name){
                    //             role_id = roles[i].id
                    //         }
                    //     }

                    // const { data, error: error2 } = await supabase
                    // .from('profiles')
                    // .update({ 
                    //         role_id: role_id 
                    //     })
                    // .eq('id', this.userEdit.user_id)

                    // if(error2){
                    //     console.log("Error2" + error2)
                    // }else{
                    //     console.log(data)
                    //     this.editDialog = !this.editDialog
                    //     this.loadUsers()
                    //     this.loadRoles()
                    // }

                }catch(error){
                    console.log(error)
                }
            },
            async deleteUser(){
                try{
                console.log("Delete User")
                this.deleteDialog = false
                this.editDialog = false

                const { data: profile, error: error1 } = await supabase
                .from('profiles')
                .delete()
                .eq('id', this.userEdit.user_id)

                    const { user, error: error2 } = await supabase.auth.api.deleteUser(
                        this.userEdit.user_id,
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjI2ODc4ODg0LCJleHAiOjE5NDI0NTQ4ODR9.qlxDnWe74GCiJLSmZ63p3t2ISC1VqUAGs6HzvxdH974'
                    )
                        if(error1 && error2){
                            console.log("error in deleting profile" + error1)
                            console.log("error in deleting user" + error1)
                        }else{
                            console.log("Delete success")
                        }
                this.loadUsers()
                }catch(error){
                    console.log(error)
                }
                
            },
            reset () {
                console.log('reset')
                this.$refs.form.reset()
                this.dialog = false
            },
        }
        
    }
</script>
