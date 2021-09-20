<template>

    <v-container
        id="dashboard"
        tag="section"
        fill-height
        fluid
    >
        <v-row class="my-10">
            <v-col
                
                cols="12"
                md="3"
                sm="3"
            >
                <base-material-stats-card
                    
                    color="#b3c6ff"
                    icon="mdi-package-variant-closed"
                    title="Cost of Rem. Stock"
                    v-bind:value="total_remaining_stock"
                    sub-icon="mdi-clock-time-four"
                    v-bind:sub-text="this.inventoryChart.data.date"
                />
            </v-col>
            <v-col
                
                cols="12"
                md="3"
                sm="3"
            >
                <base-material-stats-card
                    
                    color="warning"
                    icon="mdi-battery-low"
                    v-bind:title="lowest_stock.item_name"
                    v-bind:value="lowest_stock.quantity"
                    sub-icon="mdi-alert"
                    sub-icon-color="red"
                    sub-text="Lowest Item Stock..."
                />
            </v-col>
            <v-col
                cols="12"
                md="3"
                sm="3"
            >
                <base-material-stats-card
                    
                    color="#E91E63"
                    icon="mdi-package-variant"
                    title="Cost of Exp."
                    v-bind:value="total_exp_cost"
                    sub-icon="mdi-calendar-arrow-left"
                    sub-text="For the last 30 days"
                />
            </v-col>
            <v-col
                cols="12"
                md="3"
                sm="3"
            >
                <base-material-stats-card
                   
                    color="success"
                    icon="mdi-poll"
                    v-bind:title="highest_util.item_name"
                    v-bind:value="highest_util.item_util + '%'"
                    sub-icon="mdi-tag"
                    sub-text="Highest Item Utilization"
                />
            </v-col>
            <v-col 
                cols="12"
                md="12"
                sm="12"
            >
                <v-card>
                    <bar-chart
                        class="my-15"
                        :data="inventoryChart.data"
                        :options="inventoryChart.options"
                        :height="100"
                        v-if="inventoryChart.inventory_load"
                    >
                    </bar-chart>
                </v-card>
            </v-col>

            <v-col
                cols="12"
                md="6"
                sm="6"
            >
                <base-material-card
                    color="grey darken-2"
                    class="px-5 py-3"
                >
                    <template v-slot:heading>
                        <div class="headline font-weight-light">
                            Empty Stocks
                        </div>

                        <div class="subtitle-2 font-weight-light">
                            Items that have no remaining stocks left
                        </div>
                    </template>
                    <v-card-text>
                        <v-data-table
                        :headers="emptyStocksTable.headers"
                        :items="emptyStocksTable.stocks"
                        :items-per-page="5"
                        />
                    </v-card-text>
                </base-material-card>
            </v-col>
            <v-col
                cols="12"
                md="6"
                sm="6"
            >
                <base-material-card
                    color="#E91E63"
                    class="px-5 py-3"
                >
                    <template v-slot:heading>
                        <div class="headline font-weight-light">
                            Recently Used Items
                        </div>

                        <div class="subtitle-2 font-weight-light">
                            Items that have been transferred from inventory to operation today
                        </div>
                    </template>
                    <v-card-text>
                        <v-data-table
                        :headers="recentTransferredItems.headers"
                        :items="recentTransferredItems.stocks"
                        :items-per-page="5"
                        />
                    </v-card-text>
                </base-material-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
    import Navbar from '@/components/Navbar'
    import MaterialCard from '@/components/MaterialCard'
    import MaterialChartCard from '@/components/MaterialChartCard'
    import MaterialStatsCard from '@/components/MaterialStatsCard'
    import moment from 'moment'
    import BarChart from '@/components/BarChart.vue'
    import { supabase } from '@/supabase'

    export default {
        name: 'Home',

        components: {
            Navbar,
            'base-material-card': MaterialCard,
            'base-material-chart-card': MaterialChartCard,
            'base-material-stats-card': MaterialStatsCard,
            'bar-chart': BarChart
        },
        data(){
            return {
                item_name: [],
                total_remaining_stock: '',
                total_exp_cost: '',
                quantity: [],
                op_item_name: [],
                op_quantity: [],
                highest_util:{
                    item_name: '',
                    item_util: '',
                },
                lowest_stock: {
                    item_name: '',
                    quantity: ''
                },
                inventoryChart: {
                    inventory_load: false,
                    date: '',
                    data: {
                        labels: [],
                        datasets: [
                            {
                                label: 'In Stock',
                                data: [],
                                backgroundColor: '#b3c6ff'
                            },
                            {
                                label: 'Used',
                                data: [],
                                backgroundColor: '#ffb399'
                            }

                        ]
                    },
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Inventory Overview for the past 30 days',
                            fontSize: 20,
                            fontColor: 'info'
                        },
                        tooltips: {
                            backgroundColor: 'info',
                        },
                        scales: {
                            xAxes: [
                                {
                                    display: false,
                                    gridLines: {
                                        display: false,
                                    },
                                },
                            ],
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                    gridLines: {
                                        display: false,
                                    },
                                },
                            ],
                        },
                    },
                    responsiveOptions: [
                        ['screen and (max-width: 640px)', {
                            seriesBarDistance: 5,
                            axisX: {
                                labelInterpolationFnc: function (value) {
                                return value[0]
                                },
                            },
                        }],
                    ],
                },
                emptyStocksTable: {
                    stocks: [],
                    headers: [
                        {
                            text: 'Item',
                            align: 'start',
                            value: 'item_name'
                        },
                        {
                            text: 'Type',
                            align: 'start',
                            value: 'type'
                        },
                        {
                            text: 'Price',
                            align: 'end',
                            value: 'unit_cost'
                        }
                    ]
                },
                recentTransferredItems: {
                    stocks: [],
                    headers: [
                        {
                            text: 'Item',
                            align: 'start',
                            value: 'item_name'
                        },
                        {
                            text: 'PriceType',
                            align: 'start',
                            value: 'unit_cost'
                        },
                        {
                            text: 'Transferred',
                            align: 'end',
                            value: 'used'
                        }
                    ]
                }
            }
        },
        created(){
            this.getRemainingStockCost()
            this.getUsedCost()
            this.initializeInventoryChart()
            this.initializeLowestStock()
            this.initializeHighUtil()
            this.getEmptyStocks()
            this.getTodayOperation()
            this.getInventoryRecentDate()
            this.getOperationRecentDate()
        },
        mounted(){
            console.log(this.inventoryChart.data.datasets[0])
        },
        methods: {
            async initializeInventoryChart(){
                try{
            
                    let { data: item_inventory_chart, error } = await supabase
                    .from('inventory_overview')
                    .select('*')

                    if(error){
                        console.log(error)
                    }else{
                
                        for(let i = 0;i<item_inventory_chart.length;i++){
                            this.item_name[i] = item_inventory_chart[i].item_name
                            this.quantity[i] = item_inventory_chart[i].stock
                            this.op_quantity[i] = item_inventory_chart[i].used
                        }
                        this.inventoryChart.options.high = this.getMaxValue(this.quantity)
                        this.inventoryChart.data.labels = this.item_name
                        this.inventoryChart.data.datasets[0].data = this.quantity
                        this.inventoryChart.data.datasets[1].data = this.op_quantity

                        this.inventoryChart.inventory_load = true
                    }
                }catch(error){
                    console.log(error)
                }
            },
            async getRemainingStockCost(){

                try{
                    var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PHP',

                    // These options are needed to round to whole numbers if that's what you want.
                    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
                    });

                    let { data, error } = await supabase
                    .from('cost_rem_stock')
                    .select('*')
                        if(error){
                            console.log(error)
                        }else{
                            console.log(data)
                            this.total_remaining_stock = formatter.format(data[0].sum)

                            console.log(this.total_remaining_stock)
                        }

                }catch(error){
                    console.log(error)
                }
            },
            async getUsedCost(){

                try{
                    var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PHP',

                    // These options are needed to round to whole numbers if that's what you want.
                    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
                    });

                    let { data, error } = await supabase
                    .from('total_exp_cost')
                    .select('*')
                        if(error){
                            console.log(error)
                        }else{
                            console.log(data)
                            this.total_exp_cost = formatter.format(data[0].sum)

                            console.log(this.total_exp_cost)
                        }

                }catch(error){
                    console.log(error)
                }
            },
            async initializeLowestStock(){
                try{
                    let { data: lowest_stock, error } = await supabase
                    .from('lowest_stock')
                    .select('*')

                    if(error){
                        console.log('Lowest Stock Query Failed!')
                    }else{
                        this.lowest_stock.item_name = lowest_stock[0].item_name
                        this.lowest_stock.quantity = lowest_stock[0].quantity.toString()
                    }
                }catch(error){
                    console.log(error)
                }
            },

            async initializeHighUtil(){
                try{
                    let { data: highest_item_util, error } = await supabase
                    .from('highest_item_util')
                    .select('*')

                    if(error){
                        console.log('Lowest Stock Query Failed!')
                    }else{
                        this.highest_util.item_name = highest_item_util[0].item_name
                        this.highest_util.item_util = Math.round(highest_item_util[0].item_util).toString()
                    }
                }catch(error){
                    console.log(error)
                }
            },
            async getEmptyStocks(){
                try{

                    let { data: empty_stocks, error } = await supabase
                    .from('empty_stocks')
                    .select('*')
                    
                    if(error){
                        console.log(error)
                    }else{
                      
                        this.emptyStocksTable.stocks = empty_stocks
                   
                    }

                }catch(error){
                    console.log(error)
                }
            },  
            async getTodayOperation(){
                
                try{
                    let { data, error } = await supabase
                    .from('today_operation')
                    .select('*')

                        if(error){
                            console.log(error)
                        }else{
                            console.log(data)
                            this.recentTransferredItems.stocks = data
                            
                        }
                }catch(error){
                    console.log(error)
                }
            },
            async getInventoryRecentDate(){

                try{
                    let { data, error } = await supabase
                    .from('inventory_recent_date')
                    .select('*')

                    if(error){
                        console.log(error)
                    }else{
                        console.log(data[0].date)
                        this.inventoryChart.data.date = moment(data[0].date).calendar()
                        console.log(this.inventoryChart.data.date)
                    }

                }catch(error){
                    console.log(error)
                }
                     
            },
            async getOperationRecentDate(){
                try{
                    let { data , error } = await supabase
                    .from('operation_recent_date')
                    .select('*')

                        if(error){
                            console.log(error)
                        }else{
                            this.operationChart.data.date = moment(data[0].date).calendar()
                            console.log("from operation date")
                            console.log(data)
                        }
                }catch(error){

                }
            },
            removeNullValue(array){
                for(let i = 0; i<array.length;i++){
                    if(array[i] == undefined){
                        array[i] = 0
                    }
                }
            },
            getMaxValue(array){
                let max = 0
                for(let i=0;i<array.length;i++){
                    if(array[i] > max){
                        max = array[i]
                    }
                }
                console.log(max)
            return max = max + (max/2)
            }
        }
    }
</script>
