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
                <div class="my-4 mr-4 d-flex flex-row-reverse">
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
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="8"
                                        >
                                            <v-text-field
                                            label="Batch"
                                            required
                                            >
                                            </v-text-field>
                                        </v-col>
                                        <v-col 
                                            cols="12"
                                            md="6"
                                        >
                                            <v-select
                                                label="Item"
                                                :items="items"
                                                required
                                            >
                                            </v-select>
                                        </v-col>
                                        <v-col 
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                label="Quantity"
                                                required
                                            >
                                            </v-text-field>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
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
                                                    :max="(new Date((Date.now() + 100) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                                    min="1950-01-01"
                                                    @change="save"
                                                >
                                                </v-date-picker>   
                                            </v-menu> 
                                        </v-col>
                                    </v-row>
                                </v-container>
                            <small>*indicates required field</small>
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                                <v-btn
                                    color="black"
                                    text
                                    @click="dialog = false"
                                >
                                    Close
                                </v-btn>
                                <v-btn
                                    color="black"
                                    text
                                    @click="dialog = false"
                                >
                                    Add
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
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
                        :items="stocks"
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
        name: 'Inventory',

        components: {
            Navbar,
        },
        data (){
            return {
                search: '',
                dialog: false,
                activePicker: null,
                date: null,
                menu: false,
                items: [],
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
                        text: 'Batch ID',
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
                        text: 'Remaining',
                        value: 'quantity'
                    },
                    {
                        text: 'Unit Cost',
                        value: 'unit_cost',
                    },
                    {
                        text: 'Total',
                        value: 'total' 
                    }
                ],
            }
        },
        watch: {
            menu (val) {
                val && setTimeout(() => (this.activePicker = 'YEAR'))
            },
        },
        mounted() {
            this.loadInventory()
            this.loadItems()
        },
        methods: {
            async loadInventory () {
                let { data, error } = await supabase
                    .from('stock')
                    .select('*')

                if(error){
                    console.log(error)
                }else{
                    console.log('Success Query')
                    this.stocks = data;
                }
                
            },
            async loadItems(){
                let { data: items, error } = await supabase
                .from('items')
                .select('item_name')

                if(error){
                    console.log(error)
                }else{
                    console.log('Query Success!')
                    for(let i=0;i<items.length;i++){
                        this.items[i] = items[i].item_name
                    }
                }
            },
            save (date) {
                this.$refs.menu.save(date)
            },
        }

    }
</script>
