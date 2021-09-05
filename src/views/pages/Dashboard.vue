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
                md="9"
                sm="9"
            >
                <base-material-chart-card
                    :data="inventoryChart.data"
                    :options="inventoryChart.options"
                    :responsive-options="inventoryChart.responsiveOptions"
                    color="info"
                    hover-reveal
                    type="Bar"
                >
                    <template v-slot:reveal-actions>
                        <v-tooltip bottom>
                        <template v-slot:activator="{ attrs, on }">
                            <v-btn
                            v-bind="attrs"
                            color="info"
                            icon
                            v-on="on"
                            >
                            <v-icon
                                color="info"
                            >
                                mdi-refresh
                            </v-icon>
                            </v-btn>
                        </template>

                        <span>Refresh</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                        <template v-slot:activator="{ attrs, on }">
                            <v-btn
                            v-bind="attrs"
                            light
                            icon
                            v-on="on"
                            >
                            <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </template>

                        <span>Change Date</span>
                        </v-tooltip>
                    </template>

                    <h4 class="card-title font-weight-light mt-2 ml-2">
                        Inventory Overview
                    </h4>

                    <p class="d-inline-flex font-weight-light ml-2 mt-1">
                        Remaining Stock for every Item
                    </p>

                    <template v-slot:actions>
                        <v-icon
                        class="mr-1"
                        small
                        >
                        mdi-clock-outline
                        </v-icon>
                        <span class="caption grey--text font-weight-light">Updated {{ inventoryChart.data.date }}</span>
                    </template>
                    </base-material-chart-card>
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
        </v-row>
        <v-row  
            class="my-10"   
        >
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
                md="9"
                sm="9"
            >
                <base-material-chart-card
                    :data="operationChart.data"
                    :options="operationChart.options"
                    :responsive-options="operationChart.responsiveOptions"
                    color="#E91E63"
                    hover-reveal
                    type="Bar"
                >
                    <template v-slot:reveal-actions>
                        <v-tooltip bottom>
                        <template v-slot:activator="{ attrs, on }">
                            <v-btn
                            v-bind="attrs"
                            color="info"
                            icon
                            v-on="on"
                            >
                            <v-icon
                                color="info"
                            >
                                mdi-refresh
                            </v-icon>
                            </v-btn>
                        </template>

                        <span>Refresh</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                        <template v-slot:activator="{ attrs, on }">
                            <v-btn
                            v-bind="attrs"
                            light
                            icon
                            v-on="on"
                            >
                            <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </template>

                        <span>Change Date</span>
                        </v-tooltip>
                    </template>

                    <h4 class="card-title font-weight-light mt-2 ml-2">
                        Operation Overview <span class="grey--text font-weight-light"> -- last 30 days</span>
                    </h4>

                    <p class="d-inline-flex font-weight-light ml-2 mt-1">
                        Collected Exp. for every Item
                    </p>

                    <template v-slot:actions>
                        <v-icon
                        class="mr-1"
                        small 
                        >
                        mdi-clock-outline
                        </v-icon>
                        <span class="caption grey--text font-weight-light">Updated {{ operationChart.data.date }}</span>
                    </template>
                    </base-material-chart-card>
            </v-col>
        </v-row>
        <v-row
            class="my-10"
        >
            <v-col
                cols="12"
                md="6"
                sm="6"
            >
                <base-material-card
                    color="red darken-2"
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
    import { supabase } from '@/supabase'

    export default {
        name: 'Home',

        components: {
            Navbar,
            'base-material-card': MaterialCard,
            'base-material-chart-card': MaterialChartCard,
            'base-material-stats-card': MaterialStatsCard
        },
        data(){
            return {
                item_name: [],
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
                    data: {
                        labels: [],
                        series: [
                            [0],
                        ],
                        date: ''
                    },
                    options: {
                        axisX: {
                            showGrid: false,
                        },
                        low: 0,
                        high: 100,
                        chartPadding: {
                            top: 0,
                            right: 5,
                            bottom: 0,
                            left: 0,
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
                operationChart: {
                    data: {
                        labels: [],
                        series: [
                            [0],
                        ],
                        date: '',
                        month: ''
                    },
                    options: {
                        axisX: {
                            showGrid: false,
                        },
                        low: 0,
                        high: 100,
                        chartPadding: {
                            top: 0,
                            right: 5,
                            bottom: 0,
                            left: 0,
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
                }
            }
        },
        created(){
            this.initializeInventoryChart()
            this.initializeOperationChart()
            this.initializeLowestStock()
            this.initializeHighUtil()
            this.getEmptyStocks()
            this.getInventoryRecentDate()
            this.getOperationRecentDate()
        },
        mounted(){

        },
        methods: {
            async initializeInventoryChart(){
                try{
            
                    let { data: item_inventory_chart, error } = await supabase
                    .from('inventory_graph')
                    .select('*')

                    if(error){
                        console.log(error)
                    }else{
                        for(let i = 0;i<item_inventory_chart.length;i++){
                            this.item_name[i] = item_inventory_chart[i].item_name
                            this.quantity[i] = item_inventory_chart[i].quantity
                        }
                        this.removeNullValue(this.quantity)
                        this.inventoryChart.options.high = this.getMaxValue(this.quantity)
                        this.inventoryChart.data.labels = this.item_name
                        this.inventoryChart.data.series[0] = this.quantity
                    }
                }catch(error){
                    console.log(error)
                }
            },
            async initializeOperationChart(){
                try{
                    let { data: item_operation_chart, error } = await supabase
                    .from('item_operation_chart')
                    .select('*')

                    if(error){
                        console.log("Operation Chart Query Failed")
                    }else{
                        for(let i = 0;i<item_operation_chart.length;i++){
                            this.op_item_name[i] = item_operation_chart[i].item_name
                            this.op_quantity[i] = item_operation_chart[i].quantity
                        }
                        this.removeNullValue(this.op_quantity)
                        this.operationChart.options.high = this.getMaxValue(this.op_quantity)
                        this.operationChart.data.labels = this.op_item_name
                        this.operationChart.data.series[0] = this.op_quantity
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
