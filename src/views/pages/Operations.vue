<template>
    <v-main>
        <navbar />
            <v-container>
                
                <v-row>
                    <v-col></v-col>
                    <v-col
                        cols="12"
                        md="2"
                    >
                        <v-menu
                        v-model="menu"
                        ref="menu"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="dateRangeText"
                            label="Date Range"
                            prepend-inner-icon="mdi-calendar"
                            format="MM/DD/yyyy"
                            readonly 
                            filled
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                            @clear:clear="clear"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="dates"
                            range
                            width="300"
                            
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="menu = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="loadNewOperations"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                    </v-col>
                </v-row>
                            
                        
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
    import moment from 'moment'
    import { supabase } from '@/supabase'

    export default {
        name: 'Operations',

        components: {
            Navbar,
        },
        data (){
            return {
                search: '',
                date: '',
                menu: false,
                dates: ['',''],
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
                        value: 'item_util' 
                    },
                ],
            }
        },
        mounted() {
            this.loadOperations()
            this.getCurrentDate()
        },
        computed: {
            dateRangeText () {
                return this.dates.join(' - ')
            },
        },
        methods: {
            async loadOperations () {
                let { data, error } = await supabase
                    .from('operation_view')
                    .select('*')
                    // .gte('date_received',this.dates[0])
                    // .lte('date_received',this.dates[1])
                
                if(error){
                    console.log(error)
                }else{
                    console.log('Success Query')
                    this.operations = data;
                }
            },
            async loadNewOperations () {
                console.log(this.dates)
                
                let { data, error } = await supabase
                    .rpc('getfilterdoperation', {
                        date_end: this.dates[1], 
                        date_start: this.dates[0]
                    })
                    if (error) {
                        console.error(error)
                    }else {
                        console.log('Data: ' + data[0].item_size)
                        this.operations = data;
                        console.log("New Operation: " + this.operations)
                    }
                this.menu=false;
                
            },
            getCurrentDate(){
                const today = new Date();
                    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    this.current_date = date;    
            },
            clear(){
                console.log('Date Picker Cleared!')
                console.log(this.dateRangeText)
            },
        }

    }
</script>
