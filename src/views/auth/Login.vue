<template>
    <v-container class="fill-height" fluid>
        <v-layout row wrap>
                <!-- xs12 and sm12 to make it responsive = 12 columns on mobile and 6 columns from medium to XL layouts -->
            <v-flex xs12 sm12 md6>
                <!-- Login form here -->
                <v-card class="elevation-3">
                    <v-card-title class="justify-center">
                        Login
                    </v-card-title>
                    <v-form class="mx-14" >
                        <v-text-field
                        label="Email"
                        name="email"
                        prepend-icon="mdi-email"
                        type="text"
                        color="black"
                        v-model="formData.email"
                        />
                        <v-text-field
                        label="Password"
                        name="password"
                        prepend-icon="mdi-lock"
                        type="password"
                        color="black"
                        v-model="formData.password"
                        />
                        <div class="text-center mt-n5" @click.prevent="handleLogin">
                            <v-btn dark>Login</v-btn>
                        </div>
                    </v-form>
                </v-card>
            </v-flex>
            <v-flex xs12 sm12 md6>
                <!-- artwork here -->
                <v-card>
                    <v-img
                        src="https://images.pexels.com/photos/4195409/pexels-photo-4195409.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                    ></v-img>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { supabase } from '@/supabase'


    export default {
        name: 'Login',

        data () {
            return {
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


<v-layout row wrap>
      <!-- xs12 and sm12 to make it responsive = 12 columns on mobile and 6 columns from medium to XL layouts -->
      <v-flex xs12 sm12 md6>
        <!-- Login form here -->
      </v-flex>
      <v-flex xs12 sm12 md6>
        <!-- artwork here -->
      </v-flex>
    </v-layout>

    <v-row align="center" justify="center">
            <v-col cols="12" sm="3" md="3" lg="3"> 
                <v-card class="elevation-3">
                    <v-card-title class="justify-center">
                        Login
                    </v-card-title>
                    <v-form @submit.prevent="" class="mx-6">
                        <v-text-field
                        label="Username"
                        name="username"
                        prepend-icon="mdi-email"
                        type="text"
                        color="black"
                        />
                        <v-text-field
                        label="Password"
                        name="password"
                        prepend-icon="mdi-lock"
                        type="password"
                        color="black"
                        />
                    </v-form>
                </v-card>
            </v-col>
        </v-row>