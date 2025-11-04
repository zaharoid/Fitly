<template>
    <div class="v-ellipsis-animated">
      <div class="v-ellipsis-animated__wrapper">
        <div class="v-ellipsis-animated__inner v-loader-dots">
          <div
            v-for="dot in 4"
            :key="dot"
            class="v-loader-dots__dot"
          />
        </div>
      </div>
    </div>
  </template>
  
<style lang="scss">
.v-ellipsis-animated {
  $r_height: .16;

  &__wrapper {
    height: 0;
    padding-bottom: 100% * $r_height;
    position: relative;
    width: 100%;
  }

  &__inner {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .v-loader-dots {
    @keyframes loader-dots1 {

      0% {
        transform: scale(0);
      }

      100% {
        transform: scale(1);
      }
    }

    @keyframes loader-dots2 {

      0% {
        transform: translate(0, 0);
      }

      100% {
        transform: translate(200%, 0);
      }
    }

    @keyframes loader-dots3 {

      0% {
        transform: scale(1);
      }

      100% {
        transform: scale(0);
      }
    }

    &__dot {
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
      background-color: theme('colors.primaryHover');
      border-radius: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      width: 100% * $r_height;

      &:nth-child(1) {
        animation: loader-dots1 .6s infinite;
        left: math.div(100% * 2 * $r_height, 3);
      }

      &:nth-child(2) {
        animation: loader-dots2 .6s infinite;
        left: math.div(100% * 2 * $r_height, 3);
      }

      &:nth-child(3) {
        animation: loader-dots2 .6s infinite;
        left: math.div(100% * 2 * 4 * $r_height, 3);
      }

      &:nth-child(4) {
        animation: loader-dots3 .6s infinite;
        left: math.div(100% * 2 * 7 * $r_height, 3);
      }
    }
  }
}
</style>
  