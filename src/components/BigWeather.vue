<template>
  <div class="big-weather">
    <img :src="weatherImg" :alt="weather" />
    <h1>
      {{wholeTemp}}
      <span>°{{isCelsius ? 'C' : 'F'}}</span>
    </h1>
    <h3>{{weather}}</h3>
  </div>
</template>

<script>
export default {
  name: 'BigWeather',
  props: {
    temperature: Number,
    weather: String,
    isCelsius: Boolean,
  },
  computed: {
    wholeTemp() {
      return Math.round(this.temperature);
    },
    weatherImg() {
      return `../assets/${this.weather.split(' ').join('')}.png`;
    },
  },
};
</script>

<style lang="scss" scoped>
.big-weather {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 20px 0;
    font-size: 120px;
    color: $white;

    span {
      font-family: "Noto Sans JP", sans-serif;
      font-size: 40px;
      font-weight: 400;
      color: $grey;
      margin-left: -20px;
    }
  }

  h3 {
    font-size: 28px;
  }
}
</style>
