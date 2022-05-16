<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-container fluid>
        <v-form v-model="valid">
          <v-text-field
            label="new list"
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
            class="py-4 flex-grow-1 justify-center">
            <v-card-text>
              <div>{{list}}</div>
              <p>{{findCompleted(list)}}</p>
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
  name: 'landing-page',
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
      const form = (e.target as HTMLInputElement).form
      try {
        await this.$store.dispatch('addList', this.value)
        form?.reset()
      } catch (error) {
        console.error(error)
      }
    },
    findCompleted (listName: string) {
      let total = 0
      const completed = this.tasks.filter(t=>{
        if (t.list === listName) {
          total++
          return t.completed
        }
        else return false
      })
      return `${completed.length}/${total}`
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
