<template>
  <div>
    <div class="alert-info" @click.stop="" >
      <div class="alert-layer"></div>
      <div class="alert-text">
        <div class="alert-content">
          <div style="color: #666666;word-wrap: break-word;padding-bottom: calc( 2.5rem )">{{tip}}</div>
          <div class="alert-footer">
            <li  class="fl footer_button" @click="dismiss"><span class="cancel">{{cancel}}</span></li>
            <li  class="fr footer_button" @click="dismissWithData"><span class="commit">{{commit}}</span></li>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'alert',
    props: ['tip','cancel','commit','commitData'],
    data: function () {
      return {

      }
    },

    computed: {
    },

    created: function () {
    },
    methods: {
      dismiss: function () {
        this.$emit('dismiss')
      },

      dismissWithData: function () {
        this.$emit('dismissWithData',this.commitData);
      },
    }

  }
</script>

<style scoped>

  .alert-info {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
  }

  .alert-layer {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.4;
  }

  .alert-text {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 16.875rem;
    min-height: 6rem;
    background: #fff;
    z-index: 200;
    margin: -6.25rem 0 0 -8.4375rem;
    border-radius: 5px;
    text-align: center;
  }

  .alert-content {
    margin: 0 auto;
    font-size: 1rem;
    padding-top: 0rem;
    line-height: 1.5rem;
    padding:5%;
  }

  .alert-footer {
    text-align: center;
    border-top: 1px solid #eeeeee;
    line-height: 2.5rem;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2.5rem;
  }

  .footer_button {
    width: 50%;
    height: 2.5rem;
    line-height: 1.875rem;
    font-size: 1rem;
    text-align: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: Center;
    background: #eeeeee;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .commit {
    color: #E84F47;
    background:white;
    width: 100%;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: Center;
    border-bottom-right-radius: 5px;
  }

  .cancel{
    background:white;
    width: 100%;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: Center;
    margin-right: 1px;
    border-bottom-left-radius: 5px;
  }

</style>
