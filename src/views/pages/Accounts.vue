<template>
    <v-main>
        <nav-bar />
        <v-container
            id="user-profile"
            fluid
            tag="section"
        >
            <v-row justify="center">
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
                                :rules="rules"
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
                            class="purple-input"
                            label="About Me"
                            v-model="profile.about_me"
                        />
                        </v-col>

                        <v-col
                        cols="12"
                        class="text-right"
                        >
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
            >
                <base-material-card
                class="v-card-profile"
                v-bind:avatar= "profile.avatar"
                >
                <v-card-text class="text-center">
                    <h6 class="display-1 mb-1 grey--text">
                        {{ profile.role }}
                    </h6>

                    <h4 class="display-2 font-weight-light mb-3 black--text">
                    {{ profile.first_name }} {{ profile.last_name }}
                    </h4>

                    <p class="font-weight-light grey--text">
                        {{ profile.about_me }}
                    </p>
                </v-card-text>
                </base-material-card>
            </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
    import Navbar from '@/components/Navbar'
    import MaterialCard from '@/components/MaterialCard.vue'
    import { supabase } from '@/supabase'
    

    export default {
        name: 'Accounts',

        components: {
            'nav-bar': Navbar,
            'base-material-card': MaterialCard
        },
        data(){
            return{
                user: [],
                rules: [
                    value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!'
                ],
                profile: {
                    email: '',
                    role: '',
                    avatar: '',
                    first_name: '',
                    last_name: '',
                    about_me: ''
                }
            }
        },
        mounted(){
            this.loadUser();
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
            async loadPhoto(){
                
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
            }
        }
    }
</script>
