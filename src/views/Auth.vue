<template>
    <v-app>
        <login-view></login-view>
    </v-app>
</template>

<script>
import LoginView from './auth/Login'


export default {
    name: 'Auth',
    components: {
        'login-view': LoginView
    },
}
</script>