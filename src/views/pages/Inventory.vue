<template>
    <v-container
        fluid
    >
            <v-row
                
            >
            <v-spacer></v-spacer>
                <v-col
                    justify="end"
                    align="end"
                    cols="12"
                    md="2"
                    sm="3"
                >
                    <v-menu
                        ref="menu2"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :return-value.sync="date2"
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
                            outlined
                            dense
                            filled
                            readonly
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
                            @click="getFilteredData"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col
                    justify="end"
                    align="end"
                    cols="12"
                    md="1"
                >
                    <v-dialog
                        v-model="dialog"
                        persistent
                        max-width="700px"
                    >
                <template v-slot:activator="{ on, attrs }">    
                        <v-btn
                        color="white"
                        fab
                        small
                        light
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon>mdi-plus-circle-outline</v-icon> 
                    </v-btn> 
                    
                </template>
                <v-card>
                    <v-card-title>
                        <span class="text-h5">Add Stock</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form
                                ref="form"
                            >
                            <v-row>
                                <v-col
                                    cols="12"
                                    md="2"
                                    sm="2"
                                >
                                <v-text-field
                                    label="Batch"
                                    v-model="batch"
                                    outlined
                                    disabled
                                >
                                </v-text-field>
                                    </v-col>
            
                                        <v-btn
                                            color="secondary"
                                            fab
                                            x-small
                                            
                                            :disabled="disable"
                                            @click="incrementBatch"
                                        >
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                </v-row>
                                <v-row>
                                    <v-col 
                                        cols="12"
                                        md="6"
                                        sm="6"
                                    >
                                        <v-select
                                            label="Item"
                                            :items="item_list"
                                            v-model="item"
                                            required
                                        >
                                        </v-select>
                                    </v-col>
                                    <v-col 
                                        cols="12"
                                        md="4"
                                        sm="4"
                                    >
                                        <v-text-field
                                            label="Quantity"
                                            v-model="quantity"
                                            required
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        md="4"
                                        sm="4"
                                    >
                                        <v-menu
                                            ref="menu"
                                            v-model="menu"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="auto"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    label="Expiration Date"
                                                    v-model="date"
                                                    prepend-icon="mdi-calendar"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                </v-text-field>
                                            </template>
                                            <v-date-picker
                                                v-model="date"
                                                :active-picker.sync="activePicker"
                                                :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                                max="2050-01-01"
                                                @change="save"
                                            >
                                            </v-date-picker>   
                                        </v-menu> 
                                    </v-col>
                                </v-row>
                            </v-form>
                            </v-container>
                    
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                            <v-btn
                                color="black"
                                text
                                @click="resetForm"
                            >
                                Close
                            </v-btn>
                            <v-btn
                                color="black"
                                text
                                @click.prevent="addInventory"
                            >
                                Add
                            </v-btn>
                        </v-card-actions>
                        
                    </v-card>
                </v-dialog>
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
            <v-dialog
                v-model="dialog_2"
                max-width="600px"
                :retain-focus="false"
                persistent
            >
                <v-card>
                    <v-card-title>
                        <span class="text-h5">Transfer to Operation</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col
                                    cols="12"
                                    md="2"
                                    sm="2"
                                >
                                    <v-text-field
                                        label="Batch"
                                        v-model="row_data.batch_id"
                                        disabled
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col 
                                    cols="12"
                                    md="4"
                                    sm="4"
                                >
                                    <v-text-field
                                        label="Item"
                                        v-model="row_data.item_name"
                                        disabled
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col 
                                    cols="12"
                                    md="3"
                                    sm="3"
                                >
                                    <v-text-field
                                        label="Size"
                                        v-model="row_data.size"
                                        disabled
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    md="2"
                                    sm="2"
                                >
                                    <v-text-field
                                        label="Unit"
                                        v-model="row_data.unit_name"
                                        disabled
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    md="3"
                                    sm="3"
                                >
                                    <v-text-field
                                        label="Cost"
                                        v-model="row_data.unit_cost"
                                        disabled
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col
                                    cols="12"
                                    md="6"
                                    sm="6"
                                >
                                    <v-text-field
                                        label="Date Received"
                                        v-model="row_data.date_received"
                                        disabled
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    md="6"
                                    sm="6"
                                >
                                    <v-text-field
                                        label="Expiration Date"
                                        v-model="row_data.expiration_date"
                                        disabled
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    md="12"
                                    sm="12"
                                >
                                    <v-card
                                        flat
                                        color="transparent"
                                    >
                                        <v-subheader>Transfer Amount ({{row_data.quantity}} Remaining)</v-subheader>

                                        <v-card-text>
                                        <v-row>
                                            <v-col class="pr-4">
                                            <v-slider
                                                v-model="transfer_quantity"
                                                class="align-center"
                                                :max="row_data.quantity"
                                                :min="1"
                                                hide-details
                                            >
                                                <template v-slot:append>
                                                <v-text-field
                                                    v-model="transfer_quantity"
                                                    class="mt-0 pt-0"
                                                    hide-details
                                                    single-line
                                                    type="number"
                                                    style="width: 60px"
                                                ></v-text-field>
                                                </template>
                                            </v-slider>
                                            </v-col>
                                        </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn
                            color="black"
                            text
                            @click="resetForm_2"
                        >
                            Close
                        </v-btn>
                        <v-btn
                            color="black"
                            text
                            @click.prevent="transferInventory"
                        >
                            Transfer
                        </v-btn>
                    </v-card-actions>
                </v-card>  
            </v-dialog>
            <v-data-table
                :headers="headers"
                :items="stocks"
                :search="search"
                :loading="loading"
                loading-text="Loading stocks... It might take a while"
            >
                <template v-slot:[`item.action`]="{ item }">
                    <v-tooltip
                        bottom
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn 
                                x-small
                                @click.prevent="onButtonClick(item)"
                                color="green lighten-2"
                                :disabled = "filtered"
                                v-bind="attrs"
                                v-on="on"
                            >
                                Transfer
                            </v-btn>
                        </template>
                        <span 
                            
                        >
                            Cannot Transfer on date range
                        </span>
                        <!-- <span 
                            v-else
                        >
                            Transfer to Operation
                        </span> -->
                    </v-tooltip>
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
        name: 'Inventory',

        components: {
            Navbar,
        },
        data (){
            return {
                search: '',
                dialog: false,
                dialog_2: false,
                activePicker: null,
                date: null,
                date2: '',
                dates: ['',''],
                loading: false,
                menu: false,
                menu2: false,
                filtered: false,
                disable: false,
                batch: '',
                item: '',
                item_id: '',
                item_array: '',
                timestamp: '',
                quantity: '',
                initial_quantity: '',
                transfer_quantity: '',
                inventory_subscription: undefined,
                row_data: [],
                item_list: [],
                stocks: [],
                items: [
                    {
                        text: 'Stock',
                        disabled: true,
                        href: '/inventory'
                    },
                    {
                        text: 'Operations',
                        disabled: false,
                        href: '/operations'
                    }
                ],
                headers: [
                    {
                        text: 'Batch',
                        align: 'start',
                        value: 'batch_id'
                    },
                    {
                        text: 'Item',
                        value: 'item_name',
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
                        text: 'Date Received',
                        value: 'date_received',
                    },
                    {
                        text: 'Expiration Date',
                        value: 'expiration_date',
                    },
                    {
                        text: 'Remaining Stock',
                        value: 'quantity'
                    },
                    {
                        text: 'Collected Stock',
                        value: 'initial_quantity'
                    },
                    {
                        text: 'Price',
                        value: 'unit_cost',
                    },
                    {
                        text: 'Cost of Rem. Stock',
                        value: 'total' 
                    },
                    {
                        text: 'Cost of Stock',
                        value: 'initial_total' 
                    },
                    {
                        text: 'Action',
                        align: 'end',
                        value: 'action'
                    }
                ],
            }
        },
        watch: {
            menu (val) {
                val && setTimeout(() => (this.activePicker = 'YEAR'))
            },
        },
        async created() {
            await this.loadInventory()
            await this.loadItems()
            await this.loadCurrentBatch()
        },
        mounted(){
            
        },
        computed: {
            dateRangeText () {
                return this.dates.join(' - ')
            },
        },
        methods: {
            async loadInventory () {
                this.loading = true
                let { data, error } = await supabase
                    .from('stock')
                    .select('*')
                    .order('date_received', { ascending: true })

                for(let i = 0 ;i<data.length;i++){
                    data[i].date_received = moment(data[i].date_received).format('MMMM Do YYYY, h:mm a')
                    data[i].expiration_date = moment(data[i].expiration_date).format('MMMM Do YYYY')
                }

                if(error){
                    console.log(error)
                }else{
                    this.filtered = false
                    console.log('Success Query')
                    this.stocks = data;
                    this.loading=false
                }
                
            },
            async loadItems(){
                let { data, error } = await supabase
                .from('items')
                .select('*')

                if(error){
                    console.log(error)
                }else{
                    this.item_array = data
                    console.log('Query Success!')
                    for(let i=0;i<this.item_array.length;i++){
                        this.item_list[i] = this.item_array[i].item_name
                    }
                }
            },
            async loadCurrentBatch(){
                let { data, error } = await supabase
                .from('stock_inventory')
                .select('*')
                .order('batch_id', { ascending: false })
                .limit(1)

                if(error){
                    console.log(error)
                }else{
                    console.log('Batch ID Success Query')
                    console.log('Batch: '+ data)
                    this.batch = data[0].batch_id
                }
            },
            async addInventory(){
                this.getTimestamp()
                console.log('Batch ID: ' + this.batch)
                console.log('Item: ' + this.item)
                console.log('Quantity: ' + this.quantity)
                console.log('Expiration Date: ' + this.date)
                console.log('Date Received: ' +  this.timestamp)
                
                for(let i = 0; i<this.item_array.length;i++){
                    if(this.item == this.item_array[i].item_name){
                        this.item_id = this.item_array[i].id
                        this.unit_cost = this.item_array[i].unit_cost
                    }
                }
                const total = this.quantity * this.unit_cost
                const { data, error } = await supabase
                .from('stock_inventory')
                .insert([
                    { 
                        batch_id: this.batch, 
                        item_id: this.item_id,
                        date_received: this.timestamp,
                        expiration_date: this.date,
                        quantity: this.quantity, 
                        total: total,
                        initial_quantity: this.quantity,
                        initial_total: total
                    },
                ])
                if(error){
                    console.log(error)
                }else{
                    console.log('Data Inserted Successfully', data)
                    
                    this.loadInventory()
                }
                this.resetForm()
            },
            async transferInventory(){
                const operation_total = this.transfer_quantity * this.row_data.unit_cost
                const { data, error } = await supabase
                    .from('operation')
                    .insert([
                        { 
                            inventory_id: this.row_data.id, 
                            used: this.transfer_quantity, 
                            total: operation_total
                        },
                    ])
                    if(error){
                        console.log('Transfer Failed')
                    }else{
                        const transfer = this.row_data.quantity - this.transfer_quantity
                        const inventory_total = this.row_data.unit_cost * transfer
                        console.log('Transfer Success')
                        const { data, error } = await supabase
                            .from('stock_inventory')
                            .update({ 
                                    quantity: transfer,
                                    total: inventory_total
                                })
                            .eq('id', this.row_data.id)
                            
                        this.loadInventory()
                        
                    }
                this.transfer_quantity = 1
                this.dialog_2=false
            },
            async getFilteredData(){
                this.loading=true
                console.log(this.dates)
                try{
                    let { data, error } = await supabase
                        .rpc('getstockdate', {
                            date_start: this.dates[0],
                            date_end: this.dates[1]
                        })

                    if(error){
                        console.log(error)
                    }else{
                        for(let i = 0 ;i<data.length;i++){
                            data[i].date_received = moment(data[i].date_received).format('MMMM Do YYYY, h:mm a')
                            data[i].expiration_date = moment(data[i].expiration_date).format('MMMM Do YYYY')
                        }
                        console.log(data)
                        this.filtered = true
                        this.menu2 = false
                        this.stocks = data
                        console.log(this.date2)
                        this.loading=false
                    }
                }catch(error){
                    console.log(error)
                }
            },
            incrementBatch(){
                this.batch = this.batch + 1
                this.disable = true
            },
            save (date) {
                this.$refs.menu.save(date)
            },
            save2 (date2) {
                this.$refs.menu2.save(date2)
            },
            
            getTimestamp(){
                const today = new Date();
                    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    const dateTime = date +' '+ time;
                    this.timestamp = dateTime;
            },
            onButtonClick(item){
                this.dialog_2 = !this.dialog_2
                this.row_data = item
                console.log(this.row_data)
            },
            async resetDate (){
                await this.loadInventory()
                this.menu2 = false
                this.dates = ['','']
            },
            resetForm () {
                
                this.$refs.form.reset()
                this.loadCurrentBatch()
                this.disable = false
                this.dialog = false
            },
            resetForm_2(){
                this.dialog_2 = false
                this.transfer_quantity = 1
            },
            clear(){
                console.log('Date Picker Cleared!')
                console.log(this.dateRangeText)
            },
        }

    }
</script>
