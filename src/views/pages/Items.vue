<template>
    <v-main>
        <navbar />
            <v-container>
                
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
                                    <v-form
                                        ref="form"
                                    >
                                        <v-row>
                                            <v-col
                                                cols="12"
                                            >
                                                <v-text-field
                                                label="Item Name"
                                                v-model="item_name"
                                                required
                                                >
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    label="Size"
                                                    type="number"
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
                                                    label="Unit"
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
                                                    label="Unit Cost"
                                                    type="number"
                                                    v-model="unit_cost"
                                                    required
                                                >
                                                </v-text-field>
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
                        <template v-slot:[`item.action`]="{ item }">
                            <v-dialog
                                v-model="dialog_2"
                                max-width="400px"
                                :retain-focus="false"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn 
                                        small
                                        @click.prevent="onButtonClick(item)"
                                        v-bind="attrs"
                                        v-on="on"
                                        icon
                                    >
                                        <v-icon>
                                            mdi-circle-edit-outline
                                        </v-icon>
                                        
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="text-h5">Item Action</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col
                                                    cols="12"
                                                    md="12"
                                                    sm="12"
                                                >
                                                    <v-text-field
                                                        label="Item"
                                                        v-model="row_data.item_name"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col 
                                                    cols="12"
                                                    md="12"
                                                    sm="12"
                                                >
                                                    <v-text-field
                                                        label="Size"
                                                        type="number"
                                                        v-model="row_data.size"
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
                                                    <v-select
                                                        label="Unit"
                                                        :items="units"
                                                        v-model="row_data.unit_name"
                                                    >
                                                    </v-select>
                                                </v-col>
                                                <v-col
                                                    cols="12"
                                                    md="6"
                                                    sm="6"
                                                >
                                                    <v-text-field
                                                        label="Unit Cost"
                                                        type="number"
                                                        v-model="row_data.unit_cost"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                    <v-spacer></v-spacer>
                                        <v-btn
                                            color="red darken-2"
                                            text
                                            @click.prevent="dialog_3=true"
                                        >
                                            Delete
                                        </v-btn>
                                        <v-btn
                                            color="blue"
                                            text
                                            @click.prevent="editItem"
                                        >
                                            Save
                                        </v-btn>
                                    </v-card-actions>
                                    <v-dialog
                                        v-model="dialog_3"
                                        max-width="300"
                                        :retain-focus="false"
                                    >
                                        <v-card>
                                            <v-card-title>
                                            Are you sure?

                                            <v-spacer />

                                            <v-icon
                                                aria-label="Close"
                                                @click="dialog_3 = false"
                                            >
                                                mdi-close
                                            </v-icon>
                                            </v-card-title>

                                            <v-card-text class="pb-6 pt-12 text-center">
                                            <v-btn
                                                class="mr-3"
                                                text
                                                @click="dialog_3 = false"
                                            >
                                                Nevermind
                                            </v-btn>

                                            <v-btn
                                                color="red darken-2"
                                                text
                                                @click="itemDelete"
                                            >
                                                Yes
                                            </v-btn>
                                            </v-card-text>
                                        </v-card>
                                        </v-dialog>
                                </v-card>
                            </v-dialog>
                        </template>
                    </v-data-table>
                </v-card>
                <base-material-snackbar
                    v-model="snackbars.fail"
                    type="error"
                    >
                    <span class="font-weight-bold">&nbsp;FAILED&nbsp;</span> in deleting the item! - 
                    You can only delete an item that has no <span class="font-weight-bold">&nbsp;STOCK&nbsp;</span> 
                    <span class="font-weight-bold">&nbsp;and OPERATION record.&nbsp;</span>
                </base-material-snackbar>
                <base-material-snackbar
                    v-model="snackbars.success"
                    type="success"
                    >
                    <span class="font-weight-bold">&nbsp;OPERATION SUCCESS!&nbsp;</span> 
                </base-material-snackbar>
            </v-container>
    </v-main>
</template>

<script>
    import Navbar from '@/components/Navbar'
    import MaterialSnackbar from '@/components/MaterialSnackbar'
    import { supabase } from '@/supabase'

    export default {
        name: 'Items',

        components: {
            Navbar,
            'base-material-snackbar' : MaterialSnackbar
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
                dialog_2: false,
                dialog_3: false,
                units: [],
                units_array: [],
                items: [],
                row_data: [],
                disabled_field: true,
                snackbars: {
                    success: false,
                    fail: false,
                },
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
                    {
                        text: 'Action',
                        align: 'end',
                        value: 'action'
                    }
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
                    .order('item_name', { descending: false })
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
                    this.resetForm()
                }
            }, 
            async editItem(){
                try{
                    let row_data_id = 0
                    for(let i = 0;i<this.units_array.length;i++){
                        if(this.row_data.unit_name == this.units_array[i].unit_name){
                            this.row_data_id = this.units_array[i].id
                        }
                    }

                    const { data, error2 } = await supabase
                        .from('items')
                        .update({ 
                                item_name: this.row_data.item_name,
                                size: this.row_data.size,
                                unit_id: this.row_data_id,
                                unit_cost: this.row_data.unit_cost,
                            })
                        .eq('id', this.row_data.id)

                        if(error2){
                            console.log("Definetely Server Error!")
                            console.log(error)
                        }else{
                            this.resetForm_2()
                            console.log('Item Edited Successfully')
                        }
                }catch(error){
                    console.log("Error!: " +  error)
                }
            },
            async itemDelete(){
                try{
                    const { data, error } = await supabase
                        .from('items')
                        .delete()
                        .eq('id', this.row_data.id)

                        if(error){
                            console.log("Can't delete the Item" + error)
                            this.resetForm_2()
                            this.snackbars.fail = true
                        }else{
                            console.log("Item Deleted! Yay?")
                            this.resetForm_2()
                            this.snackbars.success = true
                        }
                }catch(error){
                    console.log("Error!" + error)
                }
            },
            onButtonClick(item){
                this.row_data = item
                console.log("Row Data: " + this.row_data.id)
            },     
            editButton(){
                this.disabled_field = !this.disabled_field
            },
            resetForm () {
                
                this.loadItems()
                this.dialog = false
                this.$refs.form.reset()
            },   
            resetForm_2 () {
                
                this.loadItems()
                this.dialog_3 = false
                this.dialog_2 = false
            },         
        }
    }
</script>
