//处理localstorage
var setLocal = {
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}
var list = setLocal.get("todo") || [];
var filterChecked = {
    all(list) {
        return list;
    },
    finish(list) {
        return list.filter(function(item) {
            return item.checked;
        })
    },
    unfinish(list) {
        return list.filter(function(item) {
            return !item.checked;
        })
    }
}
var vm = new Vue({
    el: ".main",
    data() {
        return {
            list: list,
            inputValue: "",
            beforeEditing: "",
            editingTodo: false,
            visibility: "all"
        }
    },
    watch: {
        list: {
            deep: true,
            handler: function() {
                setLocal.save("todo", this.list)
            }
        }
    },
    computed: {
        filterList() {
            return this.list.filter(function(item) { return !item.checked }).length
        },
        filterCheck() {
            return filterChecked[this.visibility] ? filterChecked[this.visibility](this.list) : this.list;
        }
    },
    methods: {
        addTodo() {
            this.list.push({
                title: this.inputValue,
                checked: false
            })
            this.inputValue = "";
        },
        deleteTodo(todo) {
            var index = this.list.indexOf(todo);
            this.list.splice(index, 1);
        },
        editTodo(todo) {
            this.editingTodo = todo;
            this.beforeEditing = todo.title;
        },
        change(todo) {
            this.editingTodo = "";
        },
        cancelEdit(todo) {
            todo.title = this.beforeEditing;
            this.beforeEditing = "";
            this.editingTodo = "";
        }
    },
    directives: {
        focus: {
            update(el) {
                el.focus();
            }
        }
    }

})

function hashchange() {
    var hash = window.location.hash.slice(1);
    vm.visibility = hash;
}
hashchange();
window.addEventListener("hashchange", hashchange);