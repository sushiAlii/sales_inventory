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
                                            required
                                            >
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field
                                                label="Size*"
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
                                    @click="dialog = false"
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
                dialog: false,
                units: [],
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
                console.log(item_view);
                this.items = item_view;
            },
            async loadUnits() {
                let { data: unit, error } = await supabase
                    .from('unit')
                    .select('unit_name')
                
                if(error){
                    console.log(error)
                }else{
                    for(let i = 0;i<unit.length;i++){
                        this.units[i] = unit[i].unit_name
                    }
                    console.log(this.units)
                }
            }
        }
    }
</script>
