<template>
    <div class="load"></div>
    <div class="node"></div>
    <div class="node"></div>
    <div class="node"></div>
    <div class="node"></div>
</template>

<script>
export default {
  name: 'AnimationPane',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#animationPane {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  column-gap: 10px;
  border: 1px solid black;
}

div.load {
  height: 11em;
  width: 11em;
  background-color: blue;
  border: 1px solid black;
  display: inline-block;
}

div.node {
  height: 11em;
  width: 11em;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}
</style>
