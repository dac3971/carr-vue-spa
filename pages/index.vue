<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-container>
        <h3>Suggested categories (fetched from API):</h3>
        <div v-for="item in itemsArr" :key="item">{{item}}</div>
      </v-container>
      <v-container class="pb-8">
        <v-form v-model="valid">
          <v-text-field
            label="Enter a new list name..."
            v-model="value"
            :rules="rules"
          ></v-text-field>
          <v-btn @click.prevent="submit" :disabled="!valid">ADD</v-btn>
        </v-form>
      </v-container>
      <v-container>
        <v-row v-for="(list, i) in lists" :key="i" align="center">
          <v-card
            :to="{ path: 'todo', query: { name: list }}"
            class="py-4 flex-grow-1 justify-center"
            :class="{ completed: calculateCompleted(list, true) }">
            <v-card-text>
              <div>{{list}}</div>
              <p>{{calculateCompleted(list)}}</p>
            </v-card-text>
          </v-card>
          <v-btn @click="deleteList(list.name)">delete</v-btn>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/store';

export default Vue.extend({
  name: 'todo-page',
  data: () => ({
    itemsArr: [] as string[],
    value: "" as string,
    valid: false,
    rules: [
      (v: string) => !!v || 'Name is required',
      (v: string) => v.length <= 10 || 'Name must be less than 10 characters'
    ],
  }),
  methods: {
    async submit (e: PointerEvent) {
      if (this.lists.indexOf(this.value) > -1) {
        alert('List name already used')
        return
      }
      const form = (e.target as HTMLInputElement).form
      try {
        await this.$store.dispatch('addList', this.value)
        form?.reset()
      } catch (error) {
        console.error(error)
      }
    },
    calculateCompleted (listName: string, binary = false) {
      let total = 0
      const completed = this.tasks.filter(t=>{
        if (t.list === listName) {
          total++
          return t.completed
        }
        else return false
      })
      return binary ? completed.length === total && total > 0 : `${completed.length}/${total}`
    }
  },
  computed: {
    ...mapState({
      lists: state => (state as RootState).lists,
      tasks: state => (state as RootState).tasks
    })
  },
  async fetch() {
    this.itemsArr = await fetch('http://localhost:3000/getTodos').then(async res=>res.json())
  }
})
</script>
