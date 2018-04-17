  <template>
    <div class="back">
      <div class="header">
        <h1>The Journal</h1>
      </div>
      <div class="grid-container">
        <div class="leftPage" v-if="pages.length">
            <div v-for="page in leftPages">
              <textarea v-model="page.text" class="pagetext" rows = "12" cols="36">
              {{page.text}}
              </textarea>
              <textarea class="pagetext" rows = "2" cols="36">
              page {{page.pageNumber}}
              </textarea>
              <button class="updateButton" v-on:click="updatePage(page)">submmit change</button>
              <button class="updateButton" v-on:click="deleteItem(page)">Delete page</button>
            </div>
        </div>
        <div class="rightPage" v-if="pages.length">
            <div v-for="page in rightPages">
              <textarea v-model="page.text" class="pagetext" rows = "12" cols="36">
                  {{page.text}}
              </textarea>
              <textarea class="pagetext" rows = "2" cols="36">
                page {{page.pageNumber}}
              </textarea>
              <button class="updateButton" v-on:click="updatePage(page)">submmit change</button>
              <button class="updateButton" v-on:click="deleteItem(page)">Delete page</button>
            </div>
        </div>

        <div class="control">
          <button class = "buttonSub" v-on:click="previousPage()">Previous Page</button><br>
          <button class = "buttonSub" v-on:click="nextPage()">Next Page</button><br>
        </div>
      </div>
      <div class="submition">
        <p class="intro">
          you can create a new page here<br>
          just enter whatever you want to and hit add.<br>
        </p>
        <form v-on:submit.prevent="addItem">
          <textarea v-model="text" rows = "4" cols = "36"></textarea>
          <button type="submit" class = "buttonSub">Add</button>
        </form>
      </div>

    <div class="footer">
      <font color = "white">
            <a href="https://github.com/zhaoxin0822/creative4"><font color = "lightgray">Github</font></a>
      </font>
    </div>
  </div>
</template>

<script>
export default {
name: 'Journal',
  data() {
    return {
      pages: [],
      text: '',
      pageNumber: 1, // initialize the pagenumber to one
      option: 'current',
      maxPage: 0,
      currentPage: 1,
    }
  },

  created: function() {
    console.log("I am here in created function");
    this.$store.dispatch('getFeed').then(response => {
      this.getItems();   // set the pages
      this.setMaxPage(); // set the max page
      this.initialCurrent(); // set the current page to max
      if(this.maxPage != 0){
        this.currentPage = this.maxPage;
        console.log("in created: ", this.currentPage);
      }
      console.log("The Pages: ", this.pages);
      console.log("current Page: ", this.currentPage);
      }).catch(err => {});
  },

  computed: {

    rightPages: function(){
      var current = this.currentPage; // get the current page
      var max = this.maxPage;
      //console.log(this.option);
      //console.log("current right" + this.currentPage);
      if(this.option === 'next'){
        return this.pages.filter(function(page){
          return page.pageNumber === current;
        })
      }
      //console.log(this.option);
      if(this.option === 'previous'){
        return this.pages.filter(function(page){
          //console.log("previous" + this.currentPage);
          return page.pageNumber === current;
        })
      }
      //console.log(this.option);
      //console.log("max page" + maxPage);
      // this is when the option is current
      return this.pages.filter(function(page){
        //console.log("in right pages");
        //console.log("in right pages max: ", max);
        //console.log("in right page pageNUmber: ", page.pageNumber);
        return page.pageNumber === max;
      })
      //console.log("right",right);
      //return right;
    },

    leftPages: function() {
      //console.log("the max: ", this.maxPage);
      var current = this.currentPage;
      var max = this.maxPage;
      //console.log("current left" + this.currentPage);
      if(this.option === 'next'){
        return this.pages.filter(function(page){
          return page.pageNumber === current - 1;
        })
      }
      if(this.option === 'previous'){
        return this.pages.filter(function(page){
          //console.log("previous" + this.currentPage);
          return page.pageNumber === current - 1;
        })
      }
      return this.pages.filter(function(page){
        console.log("in left pages");
        //console.log("the max: ", this.maxPage);
        return page.pageNumber === max - 1;
      })
    },

  },

  methods: {

    nextPage: function(){
      this.option = 'next';
      //console.log("current in next" + this.currentPage);
      this.currentPage++;
      //console.log("max in next" + this.maxPage);
      if(this.currentPage > this.maxPage){
        this.currentPage = this.maxPage;
      }
    },

    setMaxPage: function(){
      this.maxPage = this.pages.length;
      console.log("The max: ", this.maxPage);
    },

    initialCurrent: function(){
      this.currentPage = this.maxPage;
    },

    previousPage: function(){
      this.option = 'previous';
      this.currentPage--;
      if(this.currentPage < 1){
        this.currentPage = 1;
      }
    },

    addItem: function() {
      console.log("this is the input", this.text);
      console.log("this is the pageNumber", this.maxPage + 1);
      this.$store.dispatch('addJournal',{
       journal: this.text,
       page: this.maxPage + 1, // increase the page number
        }).then(response => {
          this.text = ""; // set the input to empty
          console.log("I am here in addItem response");
          this.getItems();
          this.setMaxPage(); // reset the max size
          this.currentPage = this.maxPage; // go to the max page
          this.option = "current";// set back to current
        }).catch(err => {
        });
    },

    updatePage: function(page){
      console.log("I am here to update");
      this.$store.dispatch('updateJournal',{
       journal: page.text,
       page: page.pageNumber, // have the current page number
        }).then(response => {
          this.getItems();
          this.option = "current";// set back to current
        }).catch(err => {
        });
    },

  	getItems: function() {
      this.pages = [];
      var tempArray = [];
      tempArray = this.$store.getters.feed;
      console.log("this is the feed:", this.$store.getters.feed);
      console.log("this is the tempArray:", tempArray);
      for (var index = 0; index < tempArray.length; ++index) {
        let page = {text:tempArray[index].journal, pageNumber:tempArray[index].page};
        console.log("this is the id:", tempArray[index].id);
        this.pages.push(page);
      }
        console.log("this is the pages:", this.pages);
    },

    deleteItem: function(page) {
      console.log("I am here to delete");
      this.$store.dispatch('updateJournal',{
       journal: "",
       page: page.pageNumber, // have the current page number
        }).then(response => {
          console.log("I am here to in delete response");
          this.getItems();
          this.option = "current";// set back to current
        }).catch(err => {
        });
          console.log("I am here after delete");
    },
  }
}
</script>

<style scoped>
.back {
  background-image:   url("https://images.freecreatives.com/wp-content/uploads/2016/02/Old-Paper-Background-For-Free-.jpg");
  background-size:     cover;
  background-repeat:   no-repeat;
  background-position: center center;
}

@media screen and (max-width : 760px){

  .intro{
    font-family: 'Indie Flower', cursive;
    font-size: 20px;
    color: white;
  }
  .leftPage{
    grid-area: left;
    padding: 20px 0;
    width: 500px;
    height: 600px;
    background-image: url(/static/images/leftpage.jpg);
    position: flex;
  }

  .rightPage{
    grid-area: right;
    padding: 20px 0;
    width: 500px;
    height: 600px;
    background-image: url(/static/images/rightpage.jpg);
    position: flex;
  }

  .pagetext{
    background-color: rgba(0, 0, 0, 0);
    text-align: left;
  }

  .control{
    padding: 10px 0;
    grid-area: control;
    background-color: rgba(0, 0, 0, 0);
  }

  .grid-container {
        padding: 20px 0;
        width: 100%;
        display: grid;
        grid-template-areas:
        'left left left left'
        'right right right right'
        'control control control control';
        grid-gap: 0px;
        background-color: rgba(0, 0, 0, 0);
      }

  .submition {
    background-color: rgba(0, 0, 100, 0.2);
    text-align: center;
    padding: 50px 0;
    font-size: 20px;
    width:100%;
  }

  .header{
      background-color: rgba(0, 50, 0, 0.3);
      text-align: center;
      padding: 10px 0;
      font-size: 20px;
      width: 100%;
      color: white;
  }

  .footer{
    background-color: rgba(0, 0, 20, 0.3);
    text-align: center;
    padding: 5px 0;
    font-size: 20px;
    width: 100%;
    height: 30px;
  }

  textarea{
    text-align: left;
    padding: 1px 5px;
    border: none;
    font-size:20pt;
    box-sizing: border-box;
    background-color: rgba(50, 0, 50, 0.3);
    margin-left: 15px;
    font-family: 'Indie Flower', cursive;
  }

  button {
      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
      background-color: rgba(100, 0, 100, 0.6);
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      opacity: 0.6;
      cursor: pointer;
      -webkit-transition-duration: 0.4s; /* Safari */
      transition-duration: 0.4s;
  }

  .buttonSub{
    border-radius: 50%;
  }

  button:hover{
      box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
      opacity: 1
  }

  .updateButton{
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    background-color: rgba(20, 20, 20, 0.2);
    border: none;
    color: black;
    padding: 10px 30px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 2px 40px;
    opacity: 0.6;
    cursor: pointer;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
  }
}

@media screen and (min-width : 760px){

  .intro{
    font-family: 'Indie Flower', cursive;
    font-size: 20px;
    color: white;
  }

  .leftPage{
    margin-left: auto;
    margin-right: 0;
    grid-area: left;
    padding: 20px 0;
    width: 500px;
    height: 600px;
    background-image: url(/static/images/leftpage.jpg);
    position: flex;
  }

  .rightPage{
    margin-right: auto;
    margin-left: 0;
    grid-area: right;
    padding: 20px 0;
    width: 500px;
    height: 600px;
    background-image: url(/static/images/rightpage.jpg);
    position: flex;
  }

  .pagetext{
    background-color: rgba(0, 0, 0, 0);
    text-align: left;
  }

  .control{
    padding: 50px 0;
    margin-left: -50%;
    grid-area: control;
    background-color: rgba(0, 0, 0, 0);
  }

  .grid-container {
        padding: 20px 0;
        width: 100%;
        height: 660px;
        display: grid;
        grid-template-areas:
        'left left left left right right right right control'
        'left left left left right right right right control';
        grid-gap: 0px;
        background-color: rgba(0, 0, 0, 0);
      }

  .submition {
    background-color: rgba(0, 0, 100, 0.2);
    text-align: center;
    padding: 100px 0;
    font-size: 20px;
    width:100%;
  }

  .header{
      background-color: rgba(0, 50, 0, 0.3);
      text-align: center;
      padding: 10px 0;
      font-size: 20px;
      width: 100%;
      color: white;
  }

  .footer{
    background-color: rgba(0, 0, 20, 0.3);
    text-align: center;
    padding: 5px 0;
    font-size: 20px;
    width: 100%;
    height: 30px;
  }

  textarea{
    text-align: left;
    padding: 1px 5px;
    border: none;
    font-size:20pt;
    box-sizing: border-box;
    background-color: rgba(50, 0, 50, 0.3);
    margin-left: 15px;
    font-family: 'Indie Flower', cursive;
  }

  button {
      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
      background-color: rgba(100, 0, 100, 0.6);
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      opacity: 0.6;
      cursor: pointer;
      -webkit-transition-duration: 0.4s; /* Safari */
      transition-duration: 0.4s;
  }

  .buttonSub{
    border-radius: 50%;
  }

  button:hover{
      box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
      opacity: 1
  }

  .updateButton{
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    background-color: rgba(20, 20, 20, 0.2);
    border: none;
    color: black;
    padding: 10px 30px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 2px 40px;
    opacity: 0.6;
    cursor: pointer;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
  }
}
</style>
