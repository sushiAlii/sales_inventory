<template>
    <v-main>
        <navbar />
            <v-container>
                <h1>Items</h1>
                <v-spacer></v-spacer>
                <div class="my-4 mr-4 d-flex flex-row-reverse">
                    <v-dialog
                        v-model="dialog"
                        persistent
                        max-width="400px"
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
                                <span class="text-h5">Register Item</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col
                                            cols="12"
                                        >
                                            <v-text-field
                                            label="Item Name*"
                                            v-model="item_name"
                                            required
                                            >
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field
                                                label="Size*"
                                                v-model="size"
                                                required
                                            >
                                            </v-text-field>
                                        </v-col>
                                        <v-col 
                                            cols="12"
                                            md="6"
                                        >
                                            <v-select
                                                :items="units"
                                                label="Unit*"
                                                v-model="unit_name"
                                                required
                                            >
                                            </v-select>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="6"
                                        >
                                            <v-text-field
                                                label="Unit Cost*"
                                                v-model="unit_cost"
                                                required
                                            >
                                            </v-text-field>
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
                                    @click.prevent="saveItems"
                                >
                                    Register
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
                        :items="items"
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
        name: 'Items',

        components: {
            Navbar,
        },
        data (){
            return {
                search: '',
                item_name: '',
                unit_name: '',
                unit_cost: '',
                unit_id: '',
                size: '',
                dialog: false,
                units: [],
                units_array: [],
                items: [],
                headers: [
                    {
                        text: 'Item',
                        align: 'start',
                        value: 'item_name'
                    },
                    {
                        text: 'Size',
                        value: 'size',
                        filterable: false
                    },
                    {
                        text: 'Unit',
                        value: 'unit_name'
                    },
                    {
                        text: 'Unit Cost',
                        align: 'end',
                        value: 'unit_cost'
                    },
                ]

            }
        },
        mounted() {
            this.loadItems()
            this.loadUnits()
        },
        methods: {
            async loadItems() {
                let { data: item_view, error } = await supabase
                    .from('item_view')
                    .select('*')
                this.items = item_view;
            },
            async loadUnits() {
                let { data: unit, error } = await supabase
                    .from('unit')
                    .select('*')
                
                if(error){
                    console.log(error)
            
                }else{
                    this.units_array = unit
                    for(let i = 0;i<this.units_array.length;i++){
                        this.units[i] = this.units_array[i].unit_name
                    }
                }
            },
        
            async saveItems(){
                // console.log(this.unit_name)

                for(let i = 0;i<this.units_array.length;i++){
                    if(this.unit_name == this.units_array[i].unit_name){
                        this.unit_id = this.units_array[i].id    
                    }
                }
                this.dialog = false
                const { data, error } = await supabase
                    .from('items')
                    .insert([
                        { 
                            item_name: this.item_name, 
                            size: this.size,
                            unit_id: this.unit_id,
                            unit_cost: this.unit_cost 
                        },
                    ])
                if(error){
                    console.log(error)

                }else{
                    console.log('Item Registered!')
                }
            }            
        }
    }
</script>
