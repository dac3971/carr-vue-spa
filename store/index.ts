import { GetterTree, ActionTree, MutationTree } from 'vuex'

// export enum Priorities { "High", "Medium", "Low" }

// export interface Task {
//     id: number,
//     name: string,
//     list: string,
//     due_date: Date,
//     priority: Priorities,
//     completed: boolean
// }
export class Task {
    id: number;
    name: string;
    list: string;
    due_date: Date;
    priority: string;
    completed: boolean;
 
    constructor(name: string, list: string, due_date: string, priority: string) {
        this.id = Date.now(),
        this.completed = false
        this.name = name,
        this.list = list,
        this.due_date = new Date(due_date),
        this.priority = priority
    }
}

export const state = () => ({
    lists: [] as string[],
    tasks: [] as Task[]
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    lists: state => state.lists,
    tasks: state => state.tasks,
}

export const mutations: MutationTree<RootState> = {
    ADD_LIST: (state, newVal: string) => {
        if (state.lists.indexOf(newVal) < 0) state.lists = [...state.lists, newVal]
    },
    ADD_TASK: (state, newVal: Task) => state.tasks = [ ...state.tasks, newVal ],
    DELETE_TASK: (state, id: number) => state.tasks = state.tasks.filter(t => t.id === id),
    DELETE_LIST: (state, list_name: string) => state = {
        lists: state.lists.filter(e => e === list_name),
        tasks: state.tasks.filter(e => e.list === list_name)
    },
    COMPLETE_TASK: (state, id: number) => {
        const index = state.tasks.findIndex(t => t.id === id);
        if (index !== -1) state.tasks[index].completed = true
    },
    UPDATE_TASK: (state, updated_val: Task) => {
        const index = state.tasks.findIndex(t => t.id === updated_val.id);
        if (index !== -1) state.tasks.splice(index, 1, updated_val)
    }
}
export const actions: ActionTree<RootState, RootState> = {
    addList({ commit }, new_val) {
        commit('ADD_LIST', new_val)
    },
    addTask({ commit }, new_val) {
        commit('ADD_TASK', new_val)
    },
    deleteTask({ commit }, id) {
        commit('DELETE_TASK', id)
    },
    updateTask({ commit }, updated_task) {
        commit('UPDATE_TASK', updated_task)
    },
    deleteList({ commit }, list_name) {
        commit('DELETE_LIST', list_name)
    },
    completeTask({ commit }, id) {
        commit('COMPLETE_TASK', id)
    },
}