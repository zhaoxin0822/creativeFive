<template>
  <div>
    <div v-if="loggedIn">
      <Journal/>
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
 import WelcomePage from './WelcomePage';
 import Journal from './Journal';
 export default {
   name: 'LoginPage',
   components: {WelcomePage,Journal},
   computed: {
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
   },
 }
</script>

<style scoped>
</style>
