<template>
  <v-container justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-row><v-btn to="/">back to list</v-btn></v-row>
      <v-row class="py-4"><h3>{{$route.query.name}}</h3></v-row>
      <v-row>
        <v-btn
          color="primary"
          dark
          @click.stop="()=>{clearDialog(); dialog = true}"
        >
          Add a new task
        </v-btn>
        <v-dialog
          v-model="dialog"
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">{{edit ? 'Edit task' : 'Add a task'}}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-radio-group
                      v-model="priority"
                      row
                    >
                      <v-radio
                        label="High Priority"
                        color="red"
                        value="High"
                      ></v-radio>
                      <v-radio
                        label="Medium Priority"
                        color="orange"
                        value="Medium"
                      ></v-radio>
                      <v-radio
                        label="Low Priority"
                        color="yellow"
                        value="Low"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="name"
                      label="Description"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Due Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            scrollable
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
              @click="$refs.menu.save(date)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
              >
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                :disabled="!(this.dialog && this.priority && this.name)"
                @click="()=>{edit ? submitUpdate() : addTask() }"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center" v-for="task in tasks" :key="task.id" align="center">
        <v-card class="py-4 flex-grow-1 justify-center" @click="completeTask(task.id)"
        >
          <v-card-text :class="{ completed: task.completed }"
            :style="[task.priority === 'High' ?
          {'color': 'red'} : task.priority === 'Medium' ? {'color': 'orange'} : {'color': 'yellow'}]">
            <div>{{task.name}}</div>
            <p>{{task.due_date}}</p>
            <p>{{task.priority}}</p>
          </v-card-text>
        </v-card>
        <v-btn v-if="!task.completed" @click.stop="()=>{clearDialog(); openEdit(task)}">edit</v-btn>
        <v-btn @click.stop="()=>{deleteTask(task.id)}">delete</v-btn>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Task, RootState } from '~/store';

export default Vue.extend({
  name: 'task-list-page',
  data: ()=>({
    dialog: false,
    priority: "High",
    id: 0,
    name: "",
    edit: false,
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString(),
    menu: false,
    modal: false,
    menu2: false,
  }),
  methods: {
    clearDialog () {
      this.dialog = false
      this.priority = 'High'
      this.id = 0
      this.name = ''
      this.edit = false
      this.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString()
    },
    async addTask () {
      if (this.tasks.findIndex(t => t.name === this.name) > -1) {
        alert('Task name already used')
        return
      }
      const task = new Task(this.name, this.$route.query.name.toString() || '', this.date, this.priority)
      try {
        await this.$store.dispatch('addTask', task)
        this.clearDialog()
      } catch (error) {
        console.error(error)
      }
    },
    openEdit (task: Task) {
      this.edit = true
      this.id = task.id
      this.name = task.name
      this.date = task.due_date
      this.priority = task.priority
      this.dialog = true
    },
    async submitUpdate () {
      const updated_task = new Task(this.name, this.$route.query.name.toString() || '', this.date, this.priority, this.id)
      try {
        await this.$store.dispatch('updateTask', updated_task)
        this.clearDialog()
      } catch (error) {
        console.error(error)
      }
    },
    async completeTask (id: number) {
      try {
        await this.$store.dispatch('completeTask', id) 
      } catch (error) {
        console.error(error)
      }
    },
    async deleteTask (id: number) {
      try {
        await this.$store.dispatch('deleteTask', id) 
      } catch (error) {
        console.error(error)
      }
    }
  },
  computed: {
    ...mapState({
      tasks: state => (state as RootState).tasks
    }),
  }
})
</script>
