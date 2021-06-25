<template>
    <v-container class="fill-height" fluid>
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
    </v-container>
</template>