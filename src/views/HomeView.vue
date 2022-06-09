<template>
  <div class="home">
    <div>
      <textarea v-html="html" name="" id="" cols="30" rows="10"></textarea>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { reactive, toRefs } from "@vue/reactivity";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
  setup() {
    const state = reactive({
      html: "<p>123</p><p>456</p>",
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>
