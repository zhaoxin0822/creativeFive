<template>
  <div class="column">
    <div class="header">

      <h1>Welcome to The Journal</h1>

      <h3>To register an acount</h3>
      <h3>Please fill out the information below</h3>

    </div>
    <div class="submission">
      <p class="error">{{registerError}}</p>
      <form v-on:submit.prevent="register" class="submitBox">
        <input class="narrow" v-model="username" placeholder="User Name"><br/>
        <input class="wide" v-model="name" placeholder="First and Last Name"><br/>
        <input class="narrow" v-model="email" placeholder="Email Address"><br/>
        <input class="narrow" type="password" v-model="password" placeholder="Password"><br/>
        <button class="alternate" type="submit">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
 export default {
   name: 'WelcomePage',
   data () {
     return {
       username: '',
       email: '',
       password: '',
       name: '',
     }
   },
   computed: {
     registerError: function() {
       return this.$store.getters.registerError;
     },
   },
   methods: {
     register: function() {
       this.$store.dispatch('register',{
	       username: this.username,
         email: this.email,
         password: this.password,
	       name: this.name,
       });
     }
   }
 }
</script>

<style scoped>
.column{
  width: 100%;
  height: 900px;
}

 img {
     width: 100px;
 }

 .header{
   font-family: 'Indie Flower', cursive;
   padding-top: 60px;
   font-size: 20px;
   width: 50%;
   margin: 0 auto;
   text-align: center;
   margin-bottom: 120px;
   color: white;
 }

 .error{
   font-size: 20px;
   width: 50%;
   margin: 0 auto;
   text-align: center;
   font-size: 20px;
   margin-bottom: 30px;
   font-weight:bold;
 }

 .submition{
   background-color: rgba(0, 0, 100, 0.2);
   font-size: 20px;
   width: 50%;
   margin: 0 auto;
 }

 .submitBox{
   background-color: rgba(0, 0, 100, 0.2);
   font-size: 20px;
   width: 30%;
   margin: 0 auto;
   padding: 35px;
 }
 .narrow {
   margin: 0 auto;
   width: 60%;
   margin-left: 15%;
   margin-top: 10px
 }
 .wide {
   margin: 0 auto;
   width: 60%;
   margin-left: 15%;
   margin-top: 10px;
 }

 .alternate{
   margin: 0 auto;
   width: 67%;
   margin-left: 15%;
   margin-top: 10px;
   margin-bottom: 15px;
 }
</style>
