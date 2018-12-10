<template>
    <div class="callout" :class="{ ['callout-'+type]: true }">
        <h4>{{ header }}</h4>
        <p>{{ message }}</p>
    </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
    type: {
      type: String,
      default: 'warning',
    },
    header: String,
    message: String,
  },
  data() {
    return {
    };
  },
};
</script>
