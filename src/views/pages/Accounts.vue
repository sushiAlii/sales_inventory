<template>

    <v-container
        id="user-profile"
        tag="section"
        
    >
        <v-row class="my-10" justify="center">
        <v-col
            cols="12"
            md="8"
        >
            <base-material-card>
            <template v-slot:heading>
                <div class="display-2 font-weight-light">
                Edit Profile
                </div>

                <div class="subtitle-1 font-weight-light">
                Complete your profile
                </div>
            </template>

            <v-form>
                <v-container class="py-0">
                <v-row>
                    <v-col
                    cols="12"
                    md="6"
                    >
                    <v-text-field
                        label="Email Address"
                        class="green-input"
                        v-model="profile.email"
                        readonly
                    />
                    </v-col>
                    <v-col
                    cols="12"
                    md="3"
                    >
                    <v-text-field
                        label="Role"
                        class="purple-input"
                        v-model="profile.role"
                        readonly
                    />
                    </v-col>
                    <v-col
                        cols="12"
                        md="3"
                    >
                        <v-file-input
                            :rules="[rules.avatar_size]"
                            type="file"
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Pick an avatar"
                            prepend-icon="mdi-camera"
                            label="Avatar"
                            @change="onFileChange"
                        ></v-file-input>
                    </v-col>
                    <v-col
                    cols="12"
                    md="6"
                    >
                    <v-text-field
                        label="First Name"
                        class="purple-input"
                        v-model="profile.first_name"
                    />
                    </v-col>

                    <v-col
                    cols="12"
                    md="6"
                    >
                    <v-text-field
                        label="Last Name"
                        class="purple-input"
                        v-model="profile.last_name"
                    />
                    </v-col>

                    <v-col cols="12">
                    <v-textarea
                        :rules="[rules.counter]"
                        class="purple-input"
                        label="About Me"
                        :counter="125"
                        v-model="profile.about_me"
                    />
                    </v-col>
                    <v-col
                        cols="12"
                        class="text-right"
                    >
                        <v-btn
                            class="mx-4"
                            color="info"
                            @click.prevent="updatePassword.dialog = !updatePassword.dialog"
                        >
                                Update Password
                        </v-btn>
                        <v-btn
                            color="success"
                            class="mr-0"
                            @click.prevent="updateProfile"
                        >
                            Update Profile
                        </v-btn>
                    </v-col>
                </v-row>
                </v-container>
            </v-form>
            </base-material-card>
        </v-col>

        <v-col
            cols="12"
            md="4"
            v-if="user_profile != null"
        >
            <base-material-card
            class="v-card-profile"
            :avatar= "user_profile.avatar_url"
            >
            <v-card-text class="text-center">
                <h6 class="headline mb-1 grey--text">
                    {{ profile.role }}
                </h6>

                <h4 class="headline font-weight-light mb-3 black--text">
                {{ profile.first_name }} {{ profile.last_name }}
                </h4>

                <p class="font-weight-light grey--text">
                    {{ profile.about_me }}
                </p>
            </v-card-text>
            </base-material-card>
        </v-col>
        <v-col
            cols="12"
            md="4"
            v-if="user_profile == null"
        >
            <base-material-card
            class="v-card-profile"
            avatar= ""
            >
            <v-card-text class="text-center">
                <h6 class="headline mb-1 grey--text">
                    {{ profile.role }}
                </h6>

                <h4 class="headline font-weight-light mb-3 black--text">
                {{ profile.first_name }} {{ profile.last_name }}
                </h4>

                <p class="font-weight-light grey--text">
                    {{ profile.about_me }}
                </p>
            </v-card-text>
            </base-material-card>
        </v-col>
        </v-row>
        
        <v-dialog
            v-model="updatePassword.dialog"
            persistent
            max-width="300px"
        > 
            <v-card>
                <v-card-title>
                    <span headline>Change Password</span>
                </v-card-title>
                <v-card-text>
                <v-container>
                    <v-form
                    ref="updateForm"
                    v-model="updatePassword.valid"
                    lazy-validation
                    >
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    label="Password"
                                    v-model="updatePassword.password"
                                    :append-icon="updatePassword.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="updatePassword.showPassword ? 'text' : 'password'"
                                    :rules="updatePassword.rules.passwordRules"
                                    @click:append="updatePassword.showPassword = !updatePassword.showPassword"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    label="Confirm Password"
                                    v-model="updatePassword.confirmPassword"
                                    :append-icon="updatePassword.showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="updatePassword.showConfirmPassword ? 'text' : 'password'"
                                    :rules="updatePassword.rules.confirmPasswordRules"
                                    @click:append="updatePassword.showConfirmPassword = !updatePassword.showConfirmPassword"
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
                    @click="updateFormReset"
                >
                    Close
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="updateUserPassword"
                >
                    Update
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <base-material-snackbar
            v-model="snackbars.updateProfile.success"
            type="success"
            v-bind="{ 
                    [parsedDirection[0]]: true,
                    [parsedDirection[1]]: true
                }"
            >
            Update Profile<span class="font-weight-bold">&nbsp;SUCCESS&nbsp;</span>
        </base-material-snackbar>
        <base-material-snackbar
            v-model="snackbars.updatePassword.success"
            type="info"
            v-bind="{ 
                    [parsedDirection[0]]: true,
                    [parsedDirection[1]]: true
                }"
            >
            Password Changed<span class="font-weight-bold">&nbsp;Successfully&nbsp;</span>
        </base-material-snackbar>
    </v-container>
</template>

<script>
    import Navbar from '@/components/Navbar'
    import MaterialCard from '@/components/MaterialCard.vue'
    import MaterialSnackbar from '@/components/MaterialSnackbar'
    import { supabase } from '@/supabase'
    import { mapGetters } from "vuex";
    

    export default {
        name: 'Accounts',

        components: {
            'nav-bar': Navbar,
            'base-material-card': MaterialCard,
            'base-material-snackbar': MaterialSnackbar
        },
        data(){
            return{
                user: [],
                rules: {
                    avatar_size: value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
                    counter: value => value.length <= 125 || 'Max 125 characters',
                },
                profile: {
                    email: '',
                    role: '',
                    avatar: '',
                    first_name: '',
                    last_name: '',
                    about_me: ''
                },
                updatePassword :{
                    dialog: false,
                    valid: '',
                    password: '',
                    showPassword: false,
                    confirmPassword: '',
                    showConfirmPassword: false,
                    rules: {
                        passwordRules: [
                            v => !!v || 'Password is required',
                            v => v.length >= 8 || 'Min 8 characters',
                        ],
                        confirmPasswordRules: [
                            v => !!v || 'Confirm Password is required',
                            v => v.length >= 8 || 'Min 8 characters',
                            v => v == this.updatePassword.password || 'Password does not match'
                        ]
                    }
                },
                snackbars: {
                    direction: 'top center',
                    updateProfile: {
                        success: false,
                        fail: false,
                    },
                    updateAvatar: {
                        success: false,
                        fail: false,
                    },
                    updatePassword: {
                        success: false,
                        fail: false,
                    }
                },
            }
        },
        computed:{
            ...mapGetters({
                user_profile: 'getProfile'
            }),
            parsedDirection () {
                return this.snackbars.direction.split(' ')
            },
        },
        mounted(){
            this.loadUser();
            console.log("Mounted!")
            console.log(this.user_profile)
        },
        methods: {
            async loadUser(){
                console.log("Avatar: " + this.profile.avatar)
                const user = supabase.auth.user()
                let { data: profiles, error } = await supabase
                .from('profiles')
                .select(`
                    id, 
                    first_name, 
                    last_name, 
                    about_me, 
                    avatar_url,
                    roles(
                        role_name
                    )
                    `)
                .eq('id',user.id)

                console.log(user);
                if(error){
                    console.log(error)
                }else{
                    console.log('User Retrieved!')
                    console.log(profiles)
                    this.user = user
                    this.profile.email = user.email
                    this.profile.avatar = profiles[0].avatar_url
                    this.profile.first_name = profiles[0].first_name
                    this.profile.last_name = profiles[0].last_name
                    this.profile.role = profiles[0].roles.role_name
                    this.profile.about_me = profiles[0].about_me
                    console.log(profiles)
                    console.log(this.user)
                    console.log(this.profile.avatar)
                }


            },
            async updateProfile(){
                const { data, error } = await supabase
                .from('profiles')
                .insert([
                    { 
                        id: this.user.id,
                        first_name: this.profile.first_name,
                        last_name: this.profile.last_name,
                        about_me: this.profile.about_me
                    }], { upsert: true })

                if(error){
                    console.log('Update Failed! Please check you data.')
                }else{
                    console.log(data)
                    this.$store.dispatch("loadProfile")
                    this.snackbars.updateProfile.success = true
                }
            },
            async uploadAvatar(file){
                const fileA = file
               
                const fileExt = fileA.name.split(".").pop()
               
                const fileName = `${Math.random()}.${fileExt}`
            
                const filePath = `${fileName}`
               
                
                try{
                    const { data, error } = await supabase
                    .storage
                    .from('avatars')
                    .upload(filePath, fileA, {
                        cacheControl: 3600,
                        upsert: false
                    })
                    if(error){
                        console.log('Upload Failed')
                        
                    }else{
                        const { signedURL, error } = await supabase
                            .storage
                            .from('avatars')
                            .createSignedUrl(filePath, 31556926)

                        console.log("signedURL: " + signedURL)
                        const { data2, error2 } = await supabase
                            .from('profiles')
                            .insert([
                                { 
                                    id: this.user.id,
                                    avatar_url: signedURL
                                }], { upsert: true })


                        this.$store.dispatch("loadProfile")
                    }
                }catch(error){
                    console.log(error)
                }
            },
            async updateUserPassword(){
    
                try{
                    if(this.$refs.updateForm.validate()){
                        const { user, error } = await supabase.auth.update({
                            password: this.updatePassword.password,
                        })

                        if(error){
                            console.log(error)
                            this.snackbars.updatePassword.fail = !this.snackbars.updatePassword.fail
                            this.updateFormReset()
                        }else{
                            console.log("Change password Success!")
                            this.snackbars.updatePassword.success = !this.snackbars.updatePassword.success
                            this.updateFormReset()
                        }
                    }
                    else{
                        this.$refs.updateForm.validate()
                    }
                }catch(error){
                    console.log(error)
                }
            },
            onFileChange(file) {
                if (!file) {
                    return;
                }
                this.uploadAvatar(file);
            },
            updateFormReset () {

                this.updatePassword.dialog = false
                console.log('reset')
                this.$refs.updateForm.reset()
            },
        }
    }
</script>
