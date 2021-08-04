<template>
    <v-main>
        <navbar />
            <v-container>
                <v-breadcrumbs :items="items" large>
                    <template v-slot:item="{ item }">
                    <v-breadcrumbs-item
                        :href="item.href"
                        :disabled="item.disabled"
                        
                    >
                        {{ item.text.toUpperCase() }}
                    </v-breadcrumbs-item>
                    </template>
                </v-breadcrumbs>
                <v-card>
                    <v-card-title>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                        ></v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="operations"
                        :search="search"
                    >
                    </v-data-table>
                </v-card>
            </v-container>
    </v-main>
</template>

<script>
    import Navbar from '@/components/Navbar'
    import { supabase } from '@/supabase'

    export default {
        name: 'Operations',

        components: {
            Navbar,
        },
        data (){
            return {
                search: '',
                operations: [],
                items: [
                    {
                        text: 'Stock',
                        disabled: false,
                        href: '/inventory'
                    },
                    {
                        text: 'Operations',
                        disabled: true,
                        href: '/operations'
                    }
                ],
                headers: [
                    {
                        text: 'Item',
                        align: 'start',
                        value: 'item_name'
                    },
                    {
                        text: 'Size',
                        value: 'size'
                    },
                    {
                        text: 'Unit',
                        value: 'unit_name'
                    },
                    {
                        text: 'Used',
                        value: 'used'
                    },
                    {
                        text: 'Total',
                        value: 'total' 
                    },
                                        {
                        text: 'Daily Used',
                        value: 'daily_used' 
                    },
                                        {
                        text: 'Daily Total',
                        value: 'daily_total' 
                    },
                                        {
                        text: 'Weekly Used',
                        value: 'weekly_used' 
                    },
                                        {
                        text: 'Weekly Total',
                        value: 'weekly_total' 
                    },
                                        {
                        text: 'Item Util.',
                        value: 'item_utilization' 
                    },
                ],
            }
        },
        mounted() {
            this.loadOperations()
        },
        methods: {
            async loadOperations () {
                let { data, error } = await supabase
                    .from('operation_view')
                    .select('*')
                
                if(error){
                    console.log(error)
                }else{
                    console.log('Success Query')
                    this.operations = data;
                }
            },
        }

    }
</script>
