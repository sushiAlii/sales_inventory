<template>
  <v-container fluid>
    <v-row>
      <v-spacer></v-spacer>
      <v-col align="end" cols="12" md="2" sm="2">
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
          <v-date-picker v-model="dates" range width="300">
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="resetDate">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="getFilteredData">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col align="end" cols="12" md="1" sm="1">
        <v-dialog v-model="dialog" persistent max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="white" fab small light v-bind="attrs" v-on="on">
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add Stock</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form">
                  <v-row>
                    <v-col cols="12" md="2" sm="2">
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
                    <v-col cols="12" md="6" sm="6">
                      <v-select
                        label="Item"
                        :items="item_list"
                        v-model="item"
                        required
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                      <v-text-field
                        label="Quantity"
                        v-model="quantity"
                        required
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
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
                          :min="
                            new Date(
                              Date.now() -
                                new Date().getTimezoneOffset() * 60000
                            )
                              .toISOString()
                              .substr(0, 10)
                          "
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
              <v-btn color="black" text @click="resetForm">
                Close
              </v-btn>
              <v-btn color="black" text @click.prevent="addInventory">
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
      <v-dialog v-model="dialog_2" max-width="600px" :retain-focus="false">
        <v-card>
          <v-card-title>
            <span class="text-h5">Transfer to Operation</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="2" sm="2">
                  <v-text-field
                    label="Batch"
                    v-model="row_data.batch_id"
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="4">
                  <v-text-field
                    label="Item"
                    v-model="row_data.item_name"
                    disabled
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3" sm="3">
                  <v-text-field label="Size" v-model="row_data.size" disabled>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="2" sm="2">
                  <v-text-field
                    label="Unit"
                    v-model="row_data.unit_name"
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="3" sm="3">
                  <v-text-field
                    label="Cost"
                    v-model="row_data.unit_cost"
                    disabled
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field
                    label="Date Received"
                    v-model="row_data.date_received"
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field
                    label="Expiration Date"
                    v-model="row_data.expiration_date"
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="12" sm="12">
                  <v-card flat color="transparent">
                    <v-subheader
                      >Transfer Amount ({{
                        row_data.quantity
                      }}
                      Remaining)</v-subheader
                    >

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
            <v-btn color="black" text @click="resetForm_2">
              Close
            </v-btn>
            <v-btn color="black" text @click.prevent="transferInventory">
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
            <td></td>
            <td v-text="totals.cost_remaining_stock.total" align="end" />
            <td v-text="totals.cost_of_stock.total" align="end" />
            <td></td>
          </tr>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                x-small
                @click.prevent="onTransferClick(item)"
                color="green lighten-2"
                :disabled="filtered"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>
                  mdi-truck-delivery-outline
                </v-icon>
              </v-btn>
            </template>

            <span>
              Transfer to Operation
            </span>
            <!-- <span 
                            v-else
                        >
                            Transfer to Operation
                        </span> -->
          </v-tooltip>
          <span> |</span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                x-small
                @click.prevent="onDeleteClick(item)"
                color="red darken-1"
                :disabled="filtered"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>
              Delete
            </span>
          </v-tooltip>
        </template>
      </v-data-table>

      <v-dialog
        v-model="dialog_3"
        max-width="300"
        :retain-focus="false"
        persistent
      >
        <v-card>
          <v-card-title headline>
            Delete Item ?

            <v-spacer />
          </v-card-title>

          <v-card-text class="pb-6 pt-12 text-center">
            <v-btn class="mr-3" text @click="dialog_3 = false">
              No
            </v-btn>

            <v-btn color="red darken-2" text @click="deleteInventory">
              Yes
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
    <v-row class="mr-1 mt-2" justify="end">
      <v-btn color="blue lighten-2" x-small @click="downloadCSV"
        >Download CSV</v-btn
      >
    </v-row>
    <base-material-snackbar
      v-model="snackbars.deleteItem.success"
      type="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true,
      }"
    >
      <span class="font-weight-bold"
        >&nbsp;Item Deleted Successfully!&nbsp;</span
      >
    </base-material-snackbar>
    <base-material-snackbar
      v-model="snackbars.deleteItem.fail"
      type="error"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true,
      }"
    >
      <span class="font-weight-bold">&nbsp;Item Delete Failed&nbsp;</span>
    </base-material-snackbar>
  </v-container>
</template>

<script>
import Navbar from "@/components/Navbar";
import moment from "moment";
import { supabase } from "@/supabase";
import MaterialSnackbar from "@/components/MaterialSnackbar";
import { formatPHP } from "../../utils/currencyFormat.js";

export default {
  name: "Inventory",

  components: {
    Navbar,
    "base-material-snackbar": MaterialSnackbar,
  },
  data() {
    return {
      isFiltered: false,
      search: "",
      dialog: false,
      dialog_2: false,
      dialog_3: false,
      activePicker: null,
      date: null,
      date2: "",
      dates: ["", ""],
      loading: false,
      menu: false,
      menu2: false,
      filtered: false,
      disable: false,
      batch: "",
      item: "",
      item_id: "",
      item_array: "",
      timestamp: "",
      quantity: "",
      initial_quantity: "",
      transfer_quantity: "",
      inventory_subscription: undefined,
      row_data: [],
      item_list: [],
      stocks: [],
      snackbars: {
        direction: "top center",
        deleteItem: {
          success: false,
          fail: false,
        },
      },
      totals: {
        cost_remaining_stock: {
          total_array: [],
          total: 0,
        },
        cost_of_stock: {
          total_array: [],
          total: 0,
        },
      },
      items: [
        {
          text: "Stock",
          disabled: true,
          href: "/inventory",
        },
        {
          text: "Operations",
          disabled: false,
          href: "/operations",
        },
      ],
      headers: [
        {
          text: "Batch",
          align: "start",
          value: "batch_id",
        },
        {
          text: "Item",
          value: "item_name",
        },
        {
          text: "Size",
          align: "center",
          value: "size",
        },
        {
          text: "Unit",
          align: "center",
          value: "unit_name",
        },
        {
          text: "Date Received",
          value: "date_received",
        },
        {
          text: "Expiration Date",
          value: "expiration_date",
        },
        {
          text: "Remaining Stock",
          align: "end",
          value: "quantity",
        },
        {
          text: "Collected Stock",
          align: "end",
          value: "initial_quantity",
        },
        {
          text: "Price",
          align: "end",
          value: "unit_cost",
        },
        {
          text: "Cost of Rem. Stock",
          align: "end",
          value: "total",
        },
        {
          text: "Cost of Stock",
          align: "end",
          value: "initial_total",
        },
        {
          text: "Action",
          align: "end",
          value: "action",
        },
      ],
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  async created() {
    await this.loadInventory();
    await this.loadItems();
    await this.loadCurrentBatch();
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" - ");
    },
    parsedDirection() {
      return this.snackbars.direction.split(" ");
    },
  },
  methods: {
    async loadInventory() {
      this.loading = true;
      let { data, error } = await supabase
        .from("stock")
        .select("*")
        .order("date_received", { ascending: true });

      for (let i = 0; i < data.length; i++) {
        data[i].date_received = moment(data[i].date_received).format("lll");
        data[i].expiration_date = moment(data[i].expiration_date).format(
          "MMMM Do YYYY"
        );
        data[i].unit_cost = data[i].unit_cost.toFixed(2);
        data[i].initial_total = data[i].initial_total.toFixed(2);
        data[i].total = data[i].total.toFixed(2);
      }

      if (error) {
        console.log(error);
      } else {
        this.totals.cost_of_stock.total_array = [];
        this.totals.cost_remaining_stock.total_array = [];
        console.log(data);
        this.filtered = false;
        console.log("Success Query");
        this.stocks = data;

        this.loadCostStockArray(this.totals.cost_of_stock.total_array, data);
        this.loadRemainingArray(
          this.totals.cost_remaining_stock.total_array,
          data
        );

        console.log(this.totals.cost_of_stock.total_array);
        console.log(this.totals.cost_remaining_stock.total_array);

        this.totals.cost_of_stock.total = this.getTotal(
          this.totals.cost_of_stock.total_array
        );
        this.totals.cost_remaining_stock.total = this.getTotal(
          this.totals.cost_remaining_stock.total_array
        );
        this.totals.cost_remaining_stock.total = formatPHP.format(
          this.totals.cost_remaining_stock.total
        );
        this.totals.cost_of_stock.total = formatPHP.format(
          this.totals.cost_of_stock.total
        );
        console.log(this.totals.cost_of_stock.total);

        this.loading = false;
        this.isFiltered = false;
      }
    },
    loadCostStockArray(array, data) {
      for (let i = 0; i < data.length; i++) {
        array[i] = data[i].initial_total;
      }
    },
    loadRemainingArray(array, data) {
      for (let i = 0; i < data.length; i++) {
        array[i] = data[i].total;
      }
    },
    getTotal(array) {
      let total = 0;

      for (let i = 0; i < array.length; i++) {
        total = +total + +array[i];
      }

      return total.toFixed(2);
    },

    async loadItems() {
      let { data, error } = await supabase
        .from("items")
        .select("*")
        .order("item_name", { ascending: true });

      if (error) {
        console.log(error);
      } else {
        this.item_array = data;
        console.log("Query Success!");
        for (let i = 0; i < this.item_array.length; i++) {
          this.item_list[i] = this.item_array[i].item_name;
        }
      }
    },
    async loadCurrentBatch() {
      let { data, error } = await supabase
        .from("stock_inventory")
        .select("*")
        .order("batch_id", { ascending: false })
        .limit(1);

      if (error) {
        console.log(error);
      } else {
        console.log("Batch ID Success Query");
        console.log("Batch: " + data);
        this.batch = data[0].batch_id;
      }
    },
    async addInventory() {
      this.getTimestamp();
      console.log("Batch ID: " + this.batch);
      console.log("Item: " + this.item);
      console.log("Quantity: " + this.quantity);
      console.log("Expiration Date: " + this.date);
      console.log("Date Received: " + this.timestamp);

      for (let i = 0; i < this.item_array.length; i++) {
        if (this.item == this.item_array[i].item_name) {
          this.item_id = this.item_array[i].id;
          this.unit_cost = this.item_array[i].unit_cost;
        }
      }
      const total = this.quantity * this.unit_cost;
      const { data, error } = await supabase.from("stock_inventory").insert([
        {
          batch_id: this.batch,
          item_id: this.item_id,
          date_received: this.timestamp,
          expiration_date: this.date,
          quantity: this.quantity,
          total: total,
          initial_quantity: this.quantity,
          initial_total: total,
        },
      ]);
      if (error) {
        console.log(error);
      } else {
        console.log("Data Inserted Successfully", data);

        this.loadInventory();
      }
      this.resetForm();
    },
    async transferInventory() {
      const operation_total = this.transfer_quantity * this.row_data.unit_cost;
      const { data, error } = await supabase.from("operation").insert([
        {
          inventory_id: this.row_data.id,
          used: this.transfer_quantity,
          total: operation_total,
        },
      ]);
      if (error) {
        console.log("Transfer Failed");
      } else {
        const transfer = this.row_data.quantity - this.transfer_quantity;
        const inventory_total = this.row_data.unit_cost * transfer;
        console.log("Transfer Success");
        const { data, error } = await supabase
          .from("stock_inventory")
          .update({
            quantity: transfer,
            total: inventory_total,
          })
          .eq("id", this.row_data.id);

        this.loadInventory();
      }
      this.transfer_quantity = 1;
      this.dialog_2 = false;
    },
    async deleteInventory() {
      console.log("Delete");
      const { data, error } = await supabase
        .from("stock_inventory")
        .delete()
        .eq("id", this.row_data.id);
      if (error) {
        console.log(error);
        this.dialog_3 = !this.dialog_3;
        this.snackbars.deleteItem.fail = !this.snackbars.deleteItem.fail;
      } else {
        console.log("Delete Success");
        this.dialog_3 = !this.dialog_3;
        this.snackbars.deleteItem.success = !this.snackbars.deleteItem.success;
        await this.loadInventory();
        await this.loadCurrentBatch();
      }
    },
    async getFilteredData() {
      this.loading = true;
      console.log(this.dates);
      try {
        let { data, error } = await supabase.rpc("getstockdate", {
          date_start: this.dates[0],
          date_end: this.dates[1],
        });

        if (error) {
          console.log(error);
        } else {
          for (let i = 0; i < data.length; i++) {
            data[i].date_received = moment(data[i].date_received).format(
              "MMMM Do YYYY, h:mm a"
            );
            data[i].expiration_date = moment(data[i].expiration_date).format(
              "MMMM Do YYYY"
            );
            data[i].unit_cost = data[i].unit_cost.toFixed(2);
            data[i].initial_total = data[i].initial_total.toFixed(2);
            data[i].total = data[i].total.toFixed(2);
          }
          console.log(data);
          this.totals.cost_of_stock.total_array = [];
          this.totals.cost_remaining_stock.total_array = [];
          this.loadCostStockArray(this.totals.cost_of_stock.total_array, data);
          this.loadRemainingArray(
            this.totals.cost_remaining_stock.total_array,
            data
          );

          this.totals.cost_of_stock.total = this.getTotal(
            this.totals.cost_of_stock.total_array
          );
          this.totals.cost_remaining_stock.total = this.getTotal(
            this.totals.cost_remaining_stock.total_array
          );
          this.filtered = true;
          this.menu2 = false;
          this.stocks = data;
          console.log(this.date2);
          this.loading = false;
          this.isFiltered = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    incrementBatch() {
      this.batch = this.batch + 1;
      this.disable = true;
    },
    save(date) {
      this.$refs.menu.save(date);
    },
    save2(date2) {
      this.$refs.menu2.save(date2);
    },
    getTimestamp() {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time;
      this.timestamp = dateTime;
    },
    onTransferClick(item) {
      this.dialog_2 = !this.dialog_2;
      this.row_data = item;
      console.log(this.row_data);
    },
    onDeleteClick(item) {
      this.dialog_3 = !this.dialog_3;
      this.row_data = item;
      console.log(this.row_data);
    },
    async resetDate() {
      await this.loadInventory();
      this.menu2 = false;
      this.dates = ["", ""];
    },
    resetForm() {
      this.$refs.form.reset();
      this.loadCurrentBatch();
      this.disable = false;
      this.dialog = false;
    },
    resetForm_2() {
      this.dialog_2 = false;
      this.transfer_quantity = 1;
    },
    clear() {
      console.log("Date Picker Cleared!");
      console.log(this.dateRangeText);
    },
    async downloadCSV() {
      try {
        if (this.isFiltered == true) {
          const { data, error } = await supabase
            .rpc("getstockdate", {
              date_start: this.dates[0],
              date_end: this.dates[1],
            })
            .csv();

          if (data) {
            console.log("CSV", data);
            const anchor = document.createElement("a");
            anchor.href =
              "data:text/csv;charset=utf-8," + encodeURIComponent(data);
            anchor.target = "_blank";
            anchor.download = "Inventory.csv";
            anchor.click();
          } else {
            console.log("CSV", error);
          }
        } else if (this.isFiltered == false) {
          const { data, error } = await supabase
            .from("stock")
            .select()
            .order("date_received", { ascending: true })
            .csv();

          if (data) {
            console.log("CSV", data);
            const anchor = document.createElement("a");
            anchor.href =
              "data:text/csv;charset=utf-8," + encodeURIComponent(data);
            anchor.target = "_blank";
            anchor.download = "Inventory.csv";
            anchor.click();
          } else {
            console.log("CSV", error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style>
.sticky-table-footer td {
  font-weight: bold;
  position: sticky;
  bottom: 0;
  background-color: white;
  border-top: thin solid rgba(0, 0, 0, 0.12);
}
</style>
