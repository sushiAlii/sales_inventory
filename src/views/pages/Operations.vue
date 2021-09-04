<template>
    <v-container
        fluid
    >
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
                max-width="300"
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
                        @click="resetDate"
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
                :loading="loading"
                loading-text="Loading Operations... It might take a while"
            >
                <!-- eslint-disable-next-line -->
                <template v-slot:body.append>
            <!--    skipped -->
                    <tr class="sticky-table-footer">
                        <td v-text="'Total'" />
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td v-text="totals.cost_of_exp.total" align="end"></td>
                        <td v-text="totals.item_util.total" align="end" />
                        
                    </tr>
                </template> 
            </v-data-table>
        </v-card>
    </v-container>
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
                loading: false,
                totals: {
                    cost_of_exp: {
                        array: [],
                        total: 0
                    },
                    item_util: {
                        array: [],
                        total: 0
                    }
                },
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
                        text: 'Collected Exp.(Daily)',
                        align: 'end',
                        value: 'daily_used' 
                    },
                    {
                        text: 'Cost of Exp.(Daily)',
                        align: 'end',
                        value: 'daily_total' 
                    },
                    {
                        text: 'Collected Exp.(Weekly)',
                        align: 'end',
                        value: 'weekly_used' 
                    },
                                        {
                        text: 'Cost of Exp.(Weekly)',
                        align: 'end',
                        value: 'weekly_total' 
                    },
                    {
                        text: 'Collected Exp.',
                        align: 'end',
                        value: 'used'
                    },
                    {
                        text: 'Cost of Exp.',
                        align: 'end',
                        value: 'total' 
                    },
                    {
                        text: 'Item Util.',
                        align: 'end',
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
                this.loading = true
                let { data, error } = await supabase
                    .from('operation_view')
                    .select('*')
                    // .gte('date_received',this.dates[0])
                    // .lte('date_received',this.dates[1])
                
                if(error){
                    console.log(error)
                }else{
                    this.totals.cost_of_exp.array = []
                    this.totals.item_util.array = []

                        for(let i = 0 ;i<data.length;i++){
                            data[i].total = (data[i].total).toFixed(2)
                            this.totals.cost_of_exp.array[i] = data[i].total
                            data[i].item_util = data[i].item_util.toFixed(2)
                            this.totals.item_util.array[i] = data[i].item_util
                            data[i].daily_total = data[i].daily_total.toFixed(2)
                        }
                    this.totals.cost_of_exp.total = this.getTotal(this.totals.cost_of_exp.array)
                    this.totals.item_util.total = this.getTotal(this.totals.item_util.array)
                    console.log(this.totals.cost_of_exp.total)
                    console.log('Success Query')
                    console.log(data)
                    this.operations = data;
                    this.loading = false
                }
            },
            async loadNewOperations () {
                this.loading = true
                console.log(this.dates)
                
                this.menu=false;
                let { data, error } = await supabase
                    .rpc('getfilterdoperation', {
                        date_end: this.dates[1], 
                        date_start: this.dates[0]
                    })
                    if (error) {
                        console.error(error)
                    }else {
                        this.totals.cost_of_exp.array = []
                        this.totals.item_util.array = []

                            for(let i = 0 ;i<data.length;i++){

                                    data[i].total = data[i].total.toFixed(2)
                                        this.totals.cost_of_exp.array[i] = data[i].total

                                    data[i].item_util = data[i].item_util.toFixed(2)
                                        this.totals.item_util.array[i] = data[i].item_util

                                data[i].daily_used = data[i].daily_used.toFixed(2)
                                data[i].daily_total = data[i].daily_total.toFixed(2)
                                data[i].weekly_used = data[i].weekly_used.toFixed(2)
                                data[i].weekly_total = data[i].weekly_total.toFixed(2)
                            }
                        this.totals.cost_of_exp.total = this.getTotal(this.totals.cost_of_exp.array)
                        this.totals.item_util.total = this.getTotal(this.totals.item_util.array)
                        this.operations = data;
                        console.log("New Operation: " + this.operations)
                        this.loading = false
                    }
                
            },
            getTotal(array){
                let total = 0

                    for(let i = 0;i < array.length;i++){
                        total = +total + +array[i]
                    }
    
                return total.toFixed(2)
            },
            async resetDate(){
                await this.loadOperations()
                this.dates = ['','']
                this.menu = false

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
